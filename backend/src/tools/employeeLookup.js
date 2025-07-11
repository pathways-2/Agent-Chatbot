const EmployeeDataProcessor = require('../employeeData');

class EmployeeLookupTool {
  constructor() {
    this.name = 'employee_lookup';
    this.description = 'Searches for employee information by name, ID, email, department, or job title';
    this.employeeProcessor = new EmployeeDataProcessor();
  }

  async execute(params) {
    try {
      const { query, type = 'auto' } = params;
      
      if (!query) {
        throw new Error('Query parameter is required');
      }

      let results;
      let searchType = type;

      // Auto-detect search type if not specified
      if (type === 'auto') {
        const smartResults = this.employeeProcessor.smartSearch(query);
        results = smartResults.employees;
        searchType = smartResults.type;
      } else {
        // Use specific search type
        switch (type) {
          case 'name':
            results = this.employeeProcessor.searchByName(query);
            break;
          case 'id':
            const employee = this.employeeProcessor.searchById(query);
            results = employee ? [employee] : [];
            break;
          case 'email':
            const empByEmail = this.employeeProcessor.searchByEmail(query);
            results = empByEmail ? [empByEmail] : [];
            break;
          case 'department':
            results = this.employeeProcessor.searchByDepartment(query);
            break;
          case 'job_title':
            results = this.employeeProcessor.searchByJobTitle(query);
            break;
          default:
            results = this.employeeProcessor.smartSearch(query).employees;
        }
      }

      // Format results for display
      const formattedResults = this.employeeProcessor.formatMultipleEmployees(results);
      
      // Limit results to prevent overwhelming response
      const limitedResults = formattedResults.slice(0, 10);
      
      return {
        success: true,
        results: limitedResults,
        count: formattedResults.length,
        search_type: searchType,
        query: query,
        limited: formattedResults.length > 10,
        metadata: {
          total_found: formattedResults.length,
          showing: limitedResults.length,
          search_method: searchType
        }
      };

    } catch (error) {
      console.error('Employee lookup error:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        count: 0
      };
    }
  }

  // Get vacation balance for specific employee
  async getVacationBalance(employeeId) {
    try {
      const balance = this.employeeProcessor.getVacationBalance(employeeId);
      
      if (!balance) {
        return {
          success: false,
          error: 'Employee not found',
          balance: null
        };
      }

      return {
        success: true,
        balance: balance,
        employee_id: employeeId
      };

    } catch (error) {
      console.error('Vacation balance error:', error);
      return {
        success: false,
        error: error.message,
        balance: null
      };
    }
  }

  // Calculate vacation days after taking leave
  async calculateVacationAfterLeave(employeeId, daysToTake) {
    try {
      const calculation = this.employeeProcessor.calculateVacationAfterLeave(employeeId, daysToTake);
      
      if (!calculation) {
        return {
          success: false,
          error: 'Employee not found',
          calculation: null
        };
      }

      return {
        success: true,
        calculation: calculation,
        employee_id: employeeId,
        days_requested: daysToTake
      };

    } catch (error) {
      console.error('Vacation calculation error:', error);
      return {
        success: false,
        error: error.message,
        calculation: null
      };
    }
  }

  // Get benefits information
  async getBenefitsInfo(employeeId) {
    try {
      const benefits = this.employeeProcessor.getBenefitsInfo(employeeId);
      
      if (!benefits) {
        return {
          success: false,
          error: 'Employee not found',
          benefits: null
        };
      }

      return {
        success: true,
        benefits: benefits,
        employee_id: employeeId
      };

    } catch (error) {
      console.error('Benefits info error:', error);
      return {
        success: false,
        error: error.message,
        benefits: null
      };
    }
  }

  // Get performance information
  async getPerformanceInfo(employeeId) {
    try {
      const performance = this.employeeProcessor.getPerformanceInfo(employeeId);
      
      if (!performance) {
        return {
          success: false,
          error: 'Employee not found',
          performance: null
        };
      }

      return {
        success: true,
        performance: performance,
        employee_id: employeeId
      };

    } catch (error) {
      console.error('Performance info error:', error);
      return {
        success: false,
        error: error.message,
        performance: null
      };
    }
  }

  // Get department statistics
  async getDepartmentStats() {
    try {
      const stats = this.employeeProcessor.getDepartmentStats();
      
      return {
        success: true,
        departments: stats,
        total_departments: Object.keys(stats).length
      };

    } catch (error) {
      console.error('Department stats error:', error);
      return {
        success: false,
        error: error.message,
        departments: {}
      };
    }
  }

  // Format employee data for natural language response
  formatEmployeeForResponse(employee) {
    if (!employee) return null;

    const formatted = this.employeeProcessor.formatEmployeeForDisplay(employee);
    
    return {
      basic_info: `${formatted.name} (ID: ${formatted.employee_id})`,
      contact: `Email: ${formatted.email}, Phone: ${formatted.phone}`,
      role: `${formatted.job_title} in ${formatted.department}`,
      supervisor: `Reports to: ${formatted.supervisor}`,
      employment: `${formatted.employment_type} employee since ${formatted.hire_date}`,
      location: `Works from: ${formatted.location}`,
      time_off: `Vacation: ${formatted.vacation_balance} days, Sick: ${formatted.sick_balance} days, Personal: ${formatted.personal_balance} days`,
      performance: `Rating: ${formatted.performance_rating}, Next review: ${formatted.next_review_date}`
    };
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
            description: 'The search query (name, ID, email, department, or job title)'
          },
          type: {
            type: 'string',
            enum: ['auto', 'name', 'id', 'email', 'department', 'job_title'],
            description: 'The type of search to perform. Use "auto" for smart detection.'
          }
        },
        required: ['query']
      }
    };
  }
}

module.exports = EmployeeLookupTool; 