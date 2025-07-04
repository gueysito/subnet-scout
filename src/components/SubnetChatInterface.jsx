import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Brain, Bot, TrendingUp, DollarSign, Activity, GitBranch, Users, MessageCircle } from 'lucide-react';
import { containerStyles, cardStyles, textStyles, buttonStyles } from '../utils/styleUtils';

const SubnetChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your Subnet Scout AI assistant powered by io.net. Ask me anything about Bittensor subnets - I have real-time data on all 118 subnets including performance metrics, GitHub activity, social sentiment, and more!",
      timestamp: new Date(),
      suggestions: [
        "What's the top performing subnet right now?",
        "Show me subnet 1 details",
        "Which subnets have the most GitHub activity?",
        "What are the riskiest subnets to invest in?"
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to io.net powered backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('subnet 1') || message.includes('top performing')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Here's the latest on the top performing subnet:",
        timestamp: new Date(),
        subnetCard: {
          id: 1,
          name: "Text Prompting",
          description: "Incentivizes the production of high-quality text prompts for large language models",
          metrics: {
            price: "$127.42",
            volume24h: "$2.3M",
            activity: 94,
            health: "Excellent",
            github_commits: 156,
            kaito_score: 8.7,
            ethos_score: 9.2
          },
          latest_update: "Enhanced prompt validation system deployed",
          ai_summary: "Subnet 1 continues to dominate with consistent high performance and strong developer activity. The recent prompt validation improvements have increased quality scores by 23%. Risk level: Low. Recommendation: Strong Buy."
        }
      };
    }
    
    if (message.includes('github') || message.includes('development')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Here are the most active subnets by GitHub activity:",
        timestamp: new Date(),
        subnetList: [
          { id: 1, name: "Text Prompting", commits: 156, activity: "Very High" },
          { id: 18, name: "Cortext", commits: 143, activity: "High" },
          { id: 21, name: "FileTAO", commits: 127, activity: "High" },
          { id: 9, name: "Pretraining", commits: 98, activity: "Medium" }
        ]
      };
    }
    
    if (message.includes('risk') || message.includes('investment')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Here's the current risk assessment for high-risk subnets:",
        timestamp: new Date(),
        riskAnalysis: {
          high_risk: [
            { id: 45, name: "Subnet 45", risk_score: 8.2, reason: "Low activity, declining metrics" },
            { id: 67, name: "Subnet 67", risk_score: 7.8, reason: "Irregular performance patterns" }
          ],
          medium_risk: [
            { id: 23, name: "Subnet 23", risk_score: 5.5, reason: "Moderate volatility" },
            { id: 31, name: "Subnet 31", risk_score: 5.2, reason: "Limited track record" }
          ]
        }
      };
    }
    
    return {
      id: Date.now(),
      type: 'assistant',
      content: "I can help you with subnet analysis! Try asking about specific subnets, performance metrics, GitHub activity, or investment recommendations.",
      timestamp: new Date(),
      suggestions: [
        "Show me subnet performance rankings",
        "What's the latest on subnet development?",
        "Which subnets have the best ROI?",
        "Analyze subnet risk factors"
      ]
    };
  };

  const SubnetCard = ({ subnet }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${cardStyles.glass} mt-4 p-6 border-l-4 border-l-accent-500`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-xl ${textStyles.heading} mb-1`}>
            Subnet {subnet.id}: {subnet.name}
          </h3>
          <p className={`${textStyles.body} text-sm opacity-80`}>
            {subnet.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className={`text-sm ${textStyles.caption}`}>Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-green-400 mr-1" />
          </div>
          <div className={`text-lg font-bold ${textStyles.accent}`}>{subnet.metrics.price}</div>
          <div className={`text-xs ${textStyles.caption}`}>Price</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-blue-400 mr-1" />
          </div>
          <div className={`text-lg font-bold ${textStyles.accent}`}>{subnet.metrics.volume24h}</div>
          <div className={`text-xs ${textStyles.caption}`}>24h Volume</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-4 h-4 text-purple-400 mr-1" />
          </div>
          <div className={`text-lg font-bold ${textStyles.accent}`}>{subnet.metrics.activity}%</div>
          <div className={`text-xs ${textStyles.caption}`}>Activity</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <GitBranch className="w-4 h-4 text-orange-400 mr-1" />
          </div>
          <div className={`text-lg font-bold ${textStyles.accent}`}>{subnet.metrics.github_commits}</div>
          <div className={`text-xs ${textStyles.caption}`}>Commits</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div className="text-center">
            <div className={`text-sm ${textStyles.caption}`}>Kaito Score</div>
            <div className={`text-lg font-bold ${textStyles.accent}`}>{subnet.metrics.kaito_score}</div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${textStyles.caption}`}>Ethos Score</div>
            <div className={`text-lg font-bold ${textStyles.accent}`}>{subnet.metrics.ethos_score}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm ${textStyles.caption}`}>Health Status</div>
          <div className="text-lg font-bold text-green-400">{subnet.metrics.health}</div>
        </div>
      </div>
      
      <div className={`${cardStyles.glass} p-3 mb-4 bg-blue-500/10`}>
        <div className="flex items-center space-x-2 mb-2">
          <MessageCircle className="w-4 h-4 text-blue-400" />
          <span className={`text-sm ${textStyles.caption}`}>Latest Update</span>
        </div>
        <p className={`text-sm ${textStyles.body}`}>{subnet.latest_update}</p>
      </div>
      
      <div className={`${cardStyles.glass} p-3 bg-purple-500/10`}>
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className={`text-sm ${textStyles.caption}`}>AI Analysis</span>
        </div>
        <p className={`text-sm ${textStyles.body}`}>{subnet.ai_summary}</p>
      </div>
    </motion.div>
  );

  const SubnetList = ({ subnets, title }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${cardStyles.glass} mt-4 p-4`}
    >
      <h4 className={`text-lg ${textStyles.heading} mb-3`}>{title}</h4>
      <div className="space-y-2">
        {subnets.map((subnet) => (
          <div key={subnet.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <div>
              <span className={`font-medium ${textStyles.body}`}>
                Subnet {subnet.id}: {subnet.name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className={`text-sm ${textStyles.accent}`}>{subnet.commits} commits</div>
                <div className={`text-xs ${textStyles.caption}`}>{subnet.activity} activity</div>
              </div>
              <GitBranch className="w-4 h-4 text-orange-400" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const RiskAnalysis = ({ analysis }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${cardStyles.glass} mt-4 p-4`}
    >
      <h4 className={`text-lg ${textStyles.heading} mb-3`}>Risk Assessment</h4>
      
      <div className="space-y-4">
        <div>
          <h5 className={`text-red-400 font-medium mb-2`}>High Risk Subnets</h5>
          {analysis.high_risk.map((subnet) => (
            <div key={subnet.id} className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg mb-2">
              <span className={`${textStyles.body}`}>Subnet {subnet.id}: {subnet.name}</span>
              <div className="text-right">
                <div className="text-red-400 font-bold">{subnet.risk_score}/10</div>
                <div className={`text-xs ${textStyles.caption}`}>{subnet.reason}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <h5 className={`text-yellow-400 font-medium mb-2`}>Medium Risk Subnets</h5>
          {analysis.medium_risk.map((subnet) => (
            <div key={subnet.id} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-lg mb-2">
              <span className={`${textStyles.body}`}>Subnet {subnet.id}: {subnet.name}</span>
              <div className="text-right">
                <div className="text-yellow-400 font-bold">{subnet.risk_score}/10</div>
                <div className={`text-xs ${textStyles.caption}`}>{subnet.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const SuggestionChips = ({ suggestions, onSelect }) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(suggestion)}
          className={`px-3 py-1 text-sm ${cardStyles.glass} border border-accent-500/30 rounded-full hover:bg-accent-500/20 transition-colors`}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className={`${containerStyles.section} max-w-4xl mx-auto`}>
      <div className={`${cardStyles.glass} min-h-[600px] flex flex-col`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`text-lg ${textStyles.heading}`}>Subnet Scout AI</h3>
              <p className={`text-sm ${textStyles.caption}`}>Powered by io.net Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-sm ${textStyles.caption}`}>Online</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm ${textStyles.caption}`}>Subnet Scout AI</span>
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-accent-500/20 text-white' 
                      : 'bg-white/5 text-white'
                  }`}>
                    <p className={`${textStyles.body}`}>{message.content}</p>
                  </div>
                  
                  {message.subnetCard && <SubnetCard subnet={message.subnetCard} />}
                  {message.subnetList && <SubnetList subnets={message.subnetList} title="Top Active Subnets" />}
                  {message.riskAnalysis && <RiskAnalysis analysis={message.riskAnalysis} />}
                  {message.suggestions && <SuggestionChips suggestions={message.suggestions} onSelect={handleSendMessage} />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-2xl">
                <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about subnet performance, GitHub activity, risk analysis..."
              className={`flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent-500/50 ${textStyles.body} placeholder-gray-400`}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className={`px-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyles.primary}`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubnetChatInterface;