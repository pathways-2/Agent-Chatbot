const axios = require('axios');

class PolicySearchTool {
  constructor() {
    this.name = 'policy_search';
    this.description = 'Searches HR policies and procedures using vector search for relevant information';
    this.vectorizeApiKey = process.env.VECTORIZE_API_KEY;
    this.vectorizeEndpoint = process.env.VECTORIZE_ENDPOINT;
    this.indexName = process.env.VECTORIZE_INDEX_NAME || 'hr-policies';
    
    // Mock policy data for demonstration (replace with actual vectorize.io integration)
    this.mockPolicies = [
      {
        id: 'policy-001',
        title: 'Remote Work Policy',
        section: 'Work Arrangements',
        content: 'TechCorp supports flexible work arrangements including remote work. Employees may work remotely up to 3 days per week with manager approval. Full-time remote work requires director approval and annual review.',
        keywords: ['remote', 'work from home', 'flexible', 'telecommute', 'hybrid'],
        last_updated: '2024-01-15',
        effective_date: '2024-02-01'
      },
      {
        id: 'policy-002',
        title: 'Vacation and Time Off Policy',
        section: 'Benefits',
        content: 'Full-time employees accrue vacation time at 1.67 days per month (20 days annually). Vacation must be requested at least 2 weeks in advance. Maximum carryover is 5 days. Sick leave accrues at 1 day per month.',
        keywords: ['vacation', 'pto', 'time off', 'sick leave', 'holidays'],
        last_updated: '2024-01-10',
        effective_date: '2024-01-01'
      },
      {
        id: 'policy-003',
        title: 'Performance Review Process',
        section: 'Performance Management',
        content: 'Annual performance reviews are conducted each January. Reviews include goal assessment, competency evaluation, and development planning. Employees receive ratings of Exceeds Expectations, Meets Expectations, or Needs Improvement.',
        keywords: ['performance', 'review', 'evaluation', 'goals', 'rating'],
        last_updated: '2023-12-01',
        effective_date: '2024-01-01'
      },
      {
        id: 'policy-004',
        title: 'Health Insurance Benefits',
        section: 'Benefits',
        content: 'TechCorp provides comprehensive health insurance including medical, dental, and vision coverage. Company pays 80% of premiums for employee coverage, 60% for family coverage. Open enrollment occurs annually in November.',
        keywords: ['health', 'insurance', 'medical', 'dental', 'vision', 'benefits'],
        last_updated: '2024-01-20',
        effective_date: '2024-01-01'
      },
      {
        id: 'policy-005',
        title: 'Professional Development Policy',
        section: 'Career Development',
        content: 'Employees are allocated $2,000 annually for professional development including conferences, training, and certifications. Development plans are created during annual reviews. Tuition reimbursement available for relevant degree programs.',
        keywords: ['development', 'training', 'education', 'conference', 'certification', 'tuition'],
        last_updated: '2024-01-05',
        effective_date: '2024-01-01'
      },
      {
        id: 'policy-006',
        title: 'Code of Conduct',
        section: 'Workplace Standards',
        content: 'All employees must maintain professional conduct and adhere to company values. Harassment, discrimination, and unethical behavior are prohibited. Violations may result in disciplinary action up to and including termination.',
        keywords: ['conduct', 'ethics', 'harassment', 'discrimination', 'behavior', 'standards'],
        last_updated: '2023-11-15',
        effective_date: '2024-01-01'
      }
    ];
  }

  async execute(params) {
    try {
      const { query, section = null, limit = 5 } = params;
      
      if (!query) {
        throw new Error('Query parameter is required');
      }

      let results;
      
      // Try vectorize.io first if configured
      if (this.vectorizeApiKey && this.vectorizeEndpoint) {
        try {
          results = await this.searchVectorize(query, section, limit);
        } catch (error) {
          console.warn('Vectorize.io search failed, falling back to mock data:', error.message);
          results = this.searchMockPolicies(query, section, limit);
        }
      } else {
        // Use mock data for demonstration
        results = this.searchMockPolicies(query, section, limit);
      }

      return {
        success: true,
        results: results,
        query: query,
        section: section,
        count: results.length,
        source: this.vectorizeApiKey ? 'vectorize' : 'mock',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Policy search error:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        count: 0
      };
    }
  }

  // Search using vectorize.io (when properly configured)
  async searchVectorize(query, section, limit) {
    const searchPayload = {
      query: query,
      index: this.indexName,
      limit: limit,
      include_metadata: true
    };

    if (section) {
      searchPayload.filter = {
        section: section
      };
    }

    const response = await axios.post(
      `${this.vectorizeEndpoint}/search`,
      searchPayload,
      {
        headers: {
          'Authorization': `Bearer ${this.vectorizeApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.results.map(result => ({
      id: result.id,
      title: result.metadata.title,
      section: result.metadata.section,
      content: result.metadata.content,
      relevance_score: result.score,
      last_updated: result.metadata.last_updated,
      effective_date: result.metadata.effective_date
    }));
  }

  // Mock policy search for demonstration
  searchMockPolicies(query, section, limit) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const policy of this.mockPolicies) {
      let relevanceScore = 0;
      
      // Check if section filter matches
      if (section && !policy.section.toLowerCase().includes(section.toLowerCase())) {
        continue;
      }

      // Calculate relevance score based on keyword matches
      for (const keyword of policy.keywords) {
        if (queryLower.includes(keyword.toLowerCase())) {
          relevanceScore += 10;
        }
      }

      // Check title match
      if (policy.title.toLowerCase().includes(queryLower)) {
        relevanceScore += 15;
      }

      // Check content match
      if (policy.content.toLowerCase().includes(queryLower)) {
        relevanceScore += 5;
      }

      // Check section match
      if (policy.section.toLowerCase().includes(queryLower)) {
        relevanceScore += 8;
      }

      if (relevanceScore > 0) {
        results.push({
          ...policy,
          relevance_score: relevanceScore
        });
      }
    }

    // Sort by relevance score and return top results
    return results
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit);
  }

  // Get available policy sections
  async getPolicySections() {
    if (this.vectorizeApiKey && this.vectorizeEndpoint) {
      try {
        // In a real implementation, this would fetch available sections from vectorize.io
        return {
          success: true,
          sections: ['Work Arrangements', 'Benefits', 'Performance Management', 'Career Development', 'Workplace Standards']
        };
      } catch (error) {
        console.warn('Failed to fetch sections from vectorize.io:', error.message);
      }
    }

    // Return mock sections
    const sections = [...new Set(this.mockPolicies.map(p => p.section))];
    return {
      success: true,
      sections: sections
    };
  }

  // Search policies by section
  async searchBySection(section) {
    try {
      const policies = this.mockPolicies.filter(p => 
        p.section.toLowerCase().includes(section.toLowerCase())
      );

      return {
        success: true,
        policies: policies,
        section: section,
        count: policies.length
      };

    } catch (error) {
      console.error('Section search error:', error);
      return {
        success: false,
        error: error.message,
        policies: [],
        count: 0
      };
    }
  }

  // Get policy by ID
  async getPolicyById(policyId) {
    try {
      const policy = this.mockPolicies.find(p => p.id === policyId);
      
      if (!policy) {
        return {
          success: false,
          error: 'Policy not found',
          policy: null
        };
      }

      return {
        success: true,
        policy: policy
      };

    } catch (error) {
      console.error('Policy retrieval error:', error);
      return {
        success: false,
        error: error.message,
        policy: null
      };
    }
  }

  // Format policy results for natural language response
  formatPolicyResults(results) {
    if (!results || results.length === 0) {
      return 'No relevant policies found for your query.';
    }

    let response = `Found ${results.length} relevant policy/policies:\n\n`;
    
    results.forEach((policy, index) => {
      response += `${index + 1}. **${policy.title}** (${policy.section})\n`;
      response += `   ${policy.content}\n`;
      response += `   *Last updated: ${policy.last_updated}*\n\n`;
    });

    response += '\n*Please note: This information is for reference only. Always refer to the official employee handbook for authoritative policy details.*';

    return response;
  }

  // Get function definition for OpenAI
  getFunctionDefinition() {
    return {
      name: this.name,
      description: this.description,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for finding relevant HR policies'
          },
          section: {
            type: 'string',
            description: 'Optional: Filter results by policy section (e.g., "Benefits", "Work Arrangements")'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return (default: 5)',
            minimum: 1,
            maximum: 10
          }
        },
        required: ['query']
      }
    };
  }

  // Setup instructions for vectorize.io integration
  static getSetupInstructions() {
    return `
To connect to vectorize.io for real vector search capabilities:

1. Sign up for vectorize.io account
2. Create a new index for HR policies
3. Upload your HR policy documents to the index
4. Set environment variables:
   - VECTORIZE_API_KEY=your_api_key
   - VECTORIZE_ENDPOINT=your_endpoint_url
   - VECTORIZE_INDEX_NAME=your_index_name

5. The policy search tool will automatically use vectorize.io when configured.

For document preparation:
- Convert HR policies to text format
- Include metadata: title, section, last_updated, effective_date
- Chunk large documents for better search results
- Use descriptive titles and clear section categorization

The tool currently uses mock data for demonstration purposes.
    `;
  }
}

module.exports = PolicySearchTool; 