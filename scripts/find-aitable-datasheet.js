/**
 * Script to find the datasheet ID for "subnet scout subscribers" table
 * This will help us get the correct ID to connect to your AITable
 */

import dotenv from 'dotenv';
dotenv.config();

const AITABLE_API_KEY = process.env.AITABLE_API_KEY;
const AITABLE_BASE_URL = 'https://aitable.ai/fusion/v1';

async function findDatasheetId() {
  try {
    if (!AITABLE_API_KEY) {
      console.error('❌ AITABLE_API_KEY not found in environment variables');
      return;
    }

    console.log('🔍 Finding datasheet ID for "subnet scout subscribers" table...');

    // Step 1: Get list of spaces
    console.log('📋 Fetching spaces...');
    const spacesResponse = await fetch(`${AITABLE_BASE_URL}/spaces`, {
      headers: {
        'Authorization': `Bearer ${AITABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!spacesResponse.ok) {
      throw new Error(`Failed to fetch spaces: ${spacesResponse.status} ${spacesResponse.statusText}`);
    }

    const spacesData = await spacesResponse.json();
    console.log('✅ Spaces fetched successfully');

    if (!spacesData.data || !spacesData.data.spaces || spacesData.data.spaces.length === 0) {
      console.error('❌ No spaces found in your AITable account');
      return;
    }

    // Step 2: Search through each space for the datasheet
    for (const space of spacesData.data.spaces) {
      console.log(`🔍 Searching in space: "${space.name}" (${space.id})`);

      try {
        const nodesResponse = await fetch(`${AITABLE_BASE_URL}/spaces/${space.id}/nodes`, {
          headers: {
            'Authorization': `Bearer ${AITABLE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!nodesResponse.ok) {
          console.warn(`⚠️  Failed to fetch nodes for space ${space.name}: ${nodesResponse.status}`);
          continue;
        }

        const nodesData = await nodesResponse.json();
        
        if (nodesData.data && nodesData.data.nodes) {
          // Look for datasheet with name containing "subnet" or "scout" or "subscribers"
          const targetDatasheet = nodesData.data.nodes.find(node => 
            node.type === 'Datasheet' && 
            (node.name.toLowerCase().includes('subnet') || 
             node.name.toLowerCase().includes('scout') || 
             node.name.toLowerCase().includes('subscribers'))
          );

          if (targetDatasheet) {
            console.log('🎯 Found target datasheet!');
            console.log(`📊 Name: ${targetDatasheet.name}`);
            console.log(`🆔 Datasheet ID: ${targetDatasheet.id}`);
            console.log(`📍 Space: ${space.name}`);
            
            // Return the important information
            return {
              datasheetId: targetDatasheet.id,
              name: targetDatasheet.name,
              spaceId: space.id,
              spaceName: space.name
            };
          }

          // List ALL nodes and datasheets in this space for debugging
          console.log(`📋 All nodes in "${space.name}":`);
          nodesData.data.nodes.forEach(node => {
            console.log(`   • ${node.name} (${node.id}) - Type: ${node.type}`);
          });
          
          const datasheets = nodesData.data.nodes.filter(node => node.type === 'Datasheet');
          if (datasheets.length > 0) {
            console.log(`\n📊 Datasheets only:`);
            datasheets.forEach(ds => {
              console.log(`   • "${ds.name}" (${ds.id})`);
            });
          } else {
            console.log('⚠️  No datasheets found in this space');
          }
        }
      } catch (spaceError) {
        console.warn(`⚠️  Error searching space ${space.name}:`, spaceError.message);
      }
    }

    console.log('❌ Could not find "subnet scout subscribers" datasheet');
    console.log('💡 Make sure the table exists and the API key has access to it');

  } catch (error) {
    console.error('❌ Error finding datasheet:', error.message);
  }
}

// Run the script
findDatasheetId().then(result => {
  if (result) {
    console.log('\n🎉 Success! Add this to your .env file:');
    console.log(`AITABLE_DATASHEET_ID=${result.datasheetId}`);
    console.log(`AITABLE_SPACE_ID=${result.spaceId}`);
  }
});