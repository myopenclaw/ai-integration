// 🚀 AI INTEGRATION SETUP for Super Product
// Connects AI analysis module with the image chat platform

const { aiAnalyzer, updateConfig, testConnection } = require('./ai-integration-module');
const fs = require('fs');
const path = require('path');

class AIIntegrationManager {
    constructor() {
        this.configFile = './ai-config.json';
        this.defaultConfig = {
            mode: 'mock', // 'mock', 'openai', 'google', 'local'
            openai: {
                apiKey: '',
                model: 'gpt-4-vision-preview'
            },
            google: {
                apiKey: '',
                projectId: ''
            },
            features: {
                objectDetection: true,
                colorAnalysis: true,
                sentimentAnalysis: true,
                textExtraction: true,
                faceDetection: false,
                nsfwFilter: true
            },
            cache: {
                enabled: true,
                maxSize: 1000,
                ttl: 3600000 // 1 hour
            }
        };
        
        this.loadConfig();
    }
    
    loadConfig() {
        try {
            if (fs.existsSync(this.configFile)) {
                const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
                this.config = { ...this.defaultConfig, ...config };
                console.log('✅ AI config loaded from', this.configFile);
            } else {
                this.config = this.defaultConfig;
                this.saveConfig();
                console.log('📝 Created default AI config');
            }
            
            // Update analyzer with loaded config
            updateConfig(this.config);
            
        } catch (error) {
            console.error('❌ Error loading AI config:', error);
            this.config = this.defaultConfig;
        }
    }
    
    saveConfig() {
        try {
            fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
            console.log('💾 AI config saved to', this.configFile);
        } catch (error) {
            console.error('❌ Error saving AI config:', error);
        }
    }
    
    async testAllConnections() {
        console.log('🔍 Testing AI connections...');
        
        const results = {
            config: this.config.mode,
            tests: []
        };
        
        // Test current mode
        const connectionTest = await testConnection();
        results.tests.push({
            mode: this.config.mode,
            ...connectionTest
        });
        
        // Test OpenAI if key is present
        if (this.config.openai.apiKey) {
            console.log('Testing OpenAI...');
            const tempAnalyzer = new (require('./ai-integration-module')).AIImageAnalyzer({
                mode: 'openai',
                openai: this.config.openai
            });
            const openaiTest = await tempAnalyzer.testConnection();
            results.tests.push({
                mode: 'openai',
                ...openaiTest
            });
        }
        
        // Test Google if key is present
        if (this.config.google.apiKey) {
            console.log('Testing Google Vision...');
            const tempAnalyzer = new (require('./ai-integration-module')).AIImageAnalyzer({
                mode: 'google',
                google: this.config.google
            });
            const googleTest = await tempAnalyzer.testConnection();
            results.tests.push({
                mode: 'google',
                ...googleTest
            });
        }
        
        console.log('📊 Connection test results:', JSON.stringify(results, null, 2));
        return results;
    }
    
    getIntegrationCode() {
        return `
// AI Integration for Super Product - Generated Code
const { aiAnalyzer } = require('./ai-integration-module');

async function analyzeImageWithAI(imagePath) {
    try {
        console.log('🤖 Analyzing image with AI...');
        
        const result = await aiAnalyzer.analyzeImage(imagePath, {
            prompt: 'Analyze this image in detail. Describe objects, colors, sentiment, and any text.',
            maxTokens: 500
        });
        
        return {
            success: true,
            analysis: result.analysis,
            mode: result.mode,
            processingTime: result.processingTime
        };
        
    } catch (error) {
        console.error('AI analysis error:', error);
        return {
            success: false,
            error: error.message,
            mode: 'error'
        };
    }
}

// Integration with existing routes
function integrateWithExpress(app) {
    // Enhanced upload endpoint with AI analysis
    app.post('/api/upload-with-ai', upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image provided' });
            }
            
            const imagePath = path.join(UPLOAD_DIR, req.file.filename);
            
            // Perform AI analysis
            const aiResult = await analyzeImageWithAI(imagePath);
            
            // Store in database with AI results
            db.run(
                \`INSERT INTO images (filename, original_name, size, mime_type, analysis_result, tags) 
                 VALUES (?, ?, ?, ?, ?, ?)\`,
                [
                    req.file.filename,
                    req.file.originalname,
                    req.file.size,
                    req.file.mimetype,
                    JSON.stringify(aiResult.success ? aiResult.analysis : {}),
                    aiResult.success ? 'ai-analyzed' : 'uploaded'
                ],
                function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    
                    res.json({
                        success: true,
                        message: 'Image uploaded and analyzed with AI',
                        file: {
                            id: this.lastID,
                            originalName: req.file.originalname,
                            fileName: req.file.filename,
                            size: req.file.size,
                            url: \`/uploads/\${req.file.filename}\`,
                            aiAnalysis: aiResult
                        }
                    });
                }
            );
            
        } catch (error) {
            console.error('Upload with AI error:', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    // AI analysis endpoint for existing images
    app.post('/api/analyze-with-ai/:id', async (req, res) => {
        const imageId = req.params.id;
        
        // Get image from database
        db.get(\`SELECT * FROM images WHERE id = ?\`, [imageId], async (err, row) => {
            if (err || !row) {
                return res.status(404).json({ error: 'Image not found' });
            }
            
            const imagePath = path.join(UPLOAD_DIR, row.filename);
            
            // Perform AI analysis
            const aiResult = await analyzeImageWithAI(imagePath);
            
            // Update database with AI results
            db.run(
                \`UPDATE images SET analysis_result = ?, tags = ? WHERE id = ?\`,
                [
                    JSON.stringify(aiResult.success ? aiResult.analysis : {}),
                    'ai-analyzed',
                    imageId
                ],
                function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    
                    res.json({
                        success: true,
                        message: 'AI analysis completed',
                        analysis: aiResult
                    });
                }
            );
        });
    });
    
    // AI statistics endpoint
    app.get('/api/ai-stats', (req, res) => {
        const stats = aiAnalyzer.getStats();
        res.json({
            success: true,
            stats: stats,
            config: {
                mode: aiAnalyzer.config.mode,
                features: aiAnalyzer.config.features
            }
        });
    });
    
    console.log('✅ AI integration added to Express app');
}

module.exports = {
    analyzeImageWithAI,
    integrateWithExpress,
    aiAnalyzer
};
        `;
    }
    
    generateIntegrationFiles() {
        const integrationDir = './ai-integration';
        
        if (!fs.existsSync(integrationDir)) {
            fs.mkdirSync(integrationDir, { recursive: true });
        }
        
        // Generate integration code
        const integrationCode = this.getIntegrationCode();
        fs.writeFileSync(path.join(integrationDir, 'express-integration.js'), integrationCode);
        
        // Generate example usage
        const exampleCode = `
// Example: How to use AI integration with Super Product

const express = require('express');
const { integrateWithExpress } = require('./express-integration');

const app = express();
const PORT = 3005;

// Integrate AI routes
integrateWithExpress(app);

// Your existing routes...
app.get('/', (req, res) => {
    res.send('🚀 Super Product with AI Integration');
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
    console.log('AI endpoints available:');
    console.log('  POST /api/upload-with-ai');
    console.log('  POST /api/analyze-with-ai/:id');
    console.log('  GET  /api/ai-stats');
});
        `;
        
        fs.writeFileSync(path.join(integrationDir, 'example-server.js'), exampleCode);
        
        // Generate README
        const readme = `
# 🤖 AI Integration for Super Product

This package provides AI-powered image analysis for the Super Product image chat platform.

## Features

- **Multiple AI Backends**: Mock, OpenAI Vision, Google Cloud Vision
- **Real-time Analysis**: Process images as they're uploaded
- **Caching**: Intelligent caching for performance
- **Statistics**: Track AI usage and performance
- **Easy Integration**: Drop-in replacement for existing analysis

## Setup

1. Install dependencies:
\`\`\`bash
npm install axios
\`\`\`

2. Configure AI services in \`ai-config.json\`:
\`\`\`json
{
    "mode": "openai",
    "openai": {
        "apiKey": "your-api-key-here",
        "model": "gpt-4-vision-preview"
    }
}
\`\`\`

3. Integrate with your Express app:
\`\`\`javascript
const { integrateWithExpress } = require('./ai-integration/express-integration');
integrateWithExpress(app);
\`\`\`

## API Endpoints

### POST /api/upload-with-ai
Upload image with automatic AI analysis.

### POST /api/analyze-with-ai/:id
Analyze existing image with AI.

### GET /api/ai-stats
Get AI usage statistics.

## AI Modes

### Mock Mode (Default)
- No API keys needed
- Realistic mock analysis
- Perfect for development

### OpenAI Vision
- Requires OpenAI API key
- Advanced image understanding
- Natural language descriptions

### Google Cloud Vision
- Requires Google Cloud credentials
- Professional image analysis
- Multiple detection types

## Configuration

Edit \`ai-config.json\` to:
- Switch between AI modes
- Configure API keys
- Enable/disable features
- Adjust cache settings

## Next Steps

1. Test with mock mode first
2. Add your API keys for real AI
3. Monitor performance with /api/ai-stats
4. Extend with custom analysis prompts
        `;
        
        fs.writeFileSync(path.join(integrationDir, 'README.md'), readme);
        
        console.log('✅ AI integration files generated in', integrationDir);
        console.log('📁 Files created:');
        console.log('  • express-integration.js - Main integration module');
        console.log('  • example-server.js - Example usage');
        console.log('  • README.md - Documentation');
    }
}

// CLI interface
async function main() {
    const manager = new AIIntegrationManager();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'test':
            await manager.testAllConnections();
            break;
            
        case 'generate':
            manager.generateIntegrationFiles();
            break;
            
        case 'config':
            console.log('📋 Current AI configuration:');
            console.log(JSON.stringify(manager.config, null, 2));
            break;
            
        case 'set-mode':
            const mode = process.argv[3];
            if (['mock', 'openai', 'google', 'local'].includes(mode)) {
                manager.config.mode = mode;
                manager.saveConfig();
                updateConfig({ mode });
                console.log(`✅ AI mode set to: ${mode}`);
            } else {
                console.log('❌ Invalid mode. Use: mock, openai, google, local');
            }
            break;
            
        case 'set-openai-key':
            const key = process.argv[3];
            if (key) {
                manager.config.openai.apiKey = key;
                manager.saveConfig();
                console.log('✅ OpenAI API key saved');
            } else {
                console.log('❌ Please provide an API key');
            }
            break;
            
        default:
            console.log(`
🤖 AI Integration Manager
=========================

Commands:
  test                    - Test all AI connections
  generate                - Generate integration files
  config                  - Show current configuration
  set-mode <mode>         - Set AI mode (mock|openai|google|local)
  set-openai-key <key>    - Set OpenAI API key

Examples:
  node ai-integration-setup.js test
  node ai-integration-setup.js set-mode openai
  node ai-integration-setup.js generate
            `);
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = AIIntegrationManager;