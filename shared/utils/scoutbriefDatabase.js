import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ScoutBriefDatabase {
  constructor() {
    this.db = null;
    this.dbPath = join(__dirname, '../../data/scoutbrief.db');
    this.init();
  }

  init() {
    try {
      // Ensure data directory exists
      const dataDir = dirname(this.dbPath);
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }

      // Initialize SQLite database
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');

      // Initialize schema
      this.initializeSchema();
      
      console.log('ScoutBrief SQLite database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ScoutBrief database:', error);
      throw error;
    }
  }

  initializeSchema() {
    // Email subscribers table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scoutbrief_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        source TEXT DEFAULT 'brief_page'
      )
    `);

    // Admin brief contexts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scoutbrief_contexts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quarter TEXT NOT NULL,
        year INTEGER NOT NULL,
        context_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT DEFAULT 'admin',
        status TEXT DEFAULT 'draft',
        UNIQUE(quarter, year)
      )
    `);

    // Brief generation log table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scoutbrief_generations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        context_id INTEGER NOT NULL,
        brief_data TEXT NOT NULL,
        generation_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ai_agent TEXT NOT NULL,
        status TEXT DEFAULT 'completed',
        FOREIGN KEY (context_id) REFERENCES scoutbrief_contexts(id)
      )
    `);

    // Agent analyses table for storing individual agent results
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agent_analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quarter TEXT NOT NULL,
        subnet_id INTEGER NOT NULL,
        agent_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        analysis TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reports table for storing compiled quarterly reports
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quarter TEXT NOT NULL,
        year INTEGER NOT NULL,
        status TEXT DEFAULT 'draft',
        agent_data TEXT,
        report_content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(quarter, year)
      )
    `);

    console.log('ScoutBrief database schema initialized');
  }

  // Add email subscriber
  addSubscriber(email, source = 'brief_page') {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO scoutbrief_subscribers (email, source) 
        VALUES (?, ?)
      `);
      
      const result = stmt.run(email, source);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'ALREADY_SUBSCRIBED' };
      }
      throw error;
    }
  }

  // Get all subscribers
  getSubscribers() {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM scoutbrief_subscribers 
        WHERE status = 'active' 
        ORDER BY subscribed_at DESC
      `);
      return stmt.all();
    } catch (error) {
      console.error('Failed to get subscribers:', error);
      return [];
    }
  }

  // Add brief context
  addBriefContext(quarter, year, contextData) {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO scoutbrief_contexts (quarter, year, context_data) 
        VALUES (?, ?, ?)
      `);
      
      const result = stmt.run(quarter, year, contextData);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Failed to add brief context:', error);
      throw error;
    }
  }

  // Get latest brief context
  getLatestBriefContext() {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM scoutbrief_contexts 
        ORDER BY year DESC, quarter DESC 
        LIMIT 1
      `);
      return stmt.get();
    } catch (error) {
      console.error('Failed to get latest brief context:', error);
      return null;
    }
  }

  // Log brief generation
  logBriefGeneration(contextId, briefData, aiAgent) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO scoutbrief_generations (context_id, brief_data, ai_agent) 
        VALUES (?, ?, ?)
      `);
      
      const result = stmt.run(contextId, briefData, aiAgent);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Failed to log brief generation:', error);
      throw error;
    }
  }

  // Get database stats
  getStats() {
    try {
      const subscriberCount = this.db.prepare('SELECT COUNT(*) as count FROM scoutbrief_subscribers WHERE status = ?').get('active');
      const contextCount = this.db.prepare('SELECT COUNT(*) as count FROM scoutbrief_contexts').get();
      const reportsCount = this.db.prepare('SELECT COUNT(*) as count FROM reports').get();

      return {
        active_subscribers: subscriberCount.count,
        brief_contexts: contextCount.count,
        brief_generations: reportsCount.count
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return { error: error.message };
    }
  }

  // Store agent analysis result
  storeAgentAnalysis(quarter, subnetId, agentType, score, analysis, metadata = null) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO agent_analyses (quarter, subnet_id, agent_type, score, analysis, metadata) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(quarter, subnetId, agentType, score, analysis, JSON.stringify(metadata));
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Failed to store agent analysis:', error);
      throw error;
    }
  }

  // Get agent analyses for a quarter
  getAgentAnalyses(quarter) {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM agent_analyses 
        WHERE quarter = ? 
        ORDER BY subnet_id, agent_type
      `);
      return stmt.all(quarter);
    } catch (error) {
      console.error('Failed to get agent analyses:', error);
      return [];
    }
  }

  // Store compiled report
  storeReport(quarter, year, agentData, reportContent, status = 'draft') {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO reports (quarter, year, status, agent_data, report_content, updated_at) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const result = stmt.run(quarter, year, status, JSON.stringify(agentData), JSON.stringify(reportContent));
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Failed to store report:', error);
      throw error;
    }
  }

  // Get report for a quarter
  getReport(quarter, year) {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM reports 
        WHERE quarter = ? AND year = ?
      `);
      const report = stmt.get(quarter, year);
      if (report) {
        // Parse JSON fields
        report.agent_data = report.agent_data ? JSON.parse(report.agent_data) : null;
        report.report_content = report.report_content ? JSON.parse(report.report_content) : null;
      }
      return report;
    } catch (error) {
      console.error('Failed to get report:', error);
      return null;
    }
  }

  // Clear agent analyses for a quarter (for regeneration)
  clearAgentAnalyses(quarter) {
    try {
      const stmt = this.db.prepare('DELETE FROM agent_analyses WHERE quarter = ?');
      const result = stmt.run(quarter);
      return { success: true, deleted: result.changes };
    } catch (error) {
      console.error('Failed to clear agent analyses:', error);
      throw error;
    }
  }

  // Get all reports
  getAllReports() {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM reports 
        ORDER BY year DESC, quarter DESC
      `);
      const reports = stmt.all();
      return reports.map(report => {
        // Parse JSON fields
        report.agent_data = report.agent_data ? JSON.parse(report.agent_data) : null;
        report.report_content = report.report_content ? JSON.parse(report.report_content) : null;
        return report;
      });
    } catch (error) {
      console.error('Failed to get all reports:', error);
      return [];
    }
  }

  // Get latest report
  getLatestReport() {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM reports 
        ORDER BY year DESC, quarter DESC 
        LIMIT 1
      `);
      const report = stmt.get();
      if (report) {
        // Parse JSON fields
        report.agent_data = report.agent_data ? JSON.parse(report.agent_data) : null;
        report.report_content = report.report_content ? JSON.parse(report.report_content) : null;
      }
      return report;
    } catch (error) {
      console.error('Failed to get latest report:', error);
      return null;
    }
  }

  // Get all contexts
  getAllContexts() {
    try {
      const stmt = this.db.prepare(`
        SELECT id, quarter, year, context_data as context, created_at 
        FROM scoutbrief_contexts 
        ORDER BY year DESC, quarter DESC
      `);
      return stmt.all();
    } catch (error) {
      console.error('Failed to get all contexts:', error);
      return [];
    }
  }

  // Health check
  healthCheck() {
    try {
      this.db.prepare('SELECT 1').get();
      return { status: 'healthy', database: 'scoutbrief.db' };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
      console.log('ScoutBrief database connection closed');
    }
  }
}

// Create singleton instance
const scoutBriefDB = new ScoutBriefDatabase();

export default scoutBriefDB;