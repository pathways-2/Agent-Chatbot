class CalculatorTool {
  constructor() {
    this.name = 'calculator';
    this.description = 'Performs mathematical calculations including basic arithmetic, percentages, and HR-related calculations';
  }

  async execute(params) {
    try {
      const { expression, type = 'general', context = {} } = params;
      
      if (!expression && type !== 'monthly_working_days') {
        throw new Error('Expression parameter is required');
      }

      let result;
      let explanation;

      switch (type) {
        case 'general':
          result = this.calculateGeneral(expression);
          explanation = `Calculation: ${expression} = ${result}`;
          break;
          
        case 'vacation_calculation':
          result = this.calculateVacationDays(context);
          explanation = this.getVacationCalculationExplanation(result);
          break;
          
        case 'percentage':
          result = this.calculatePercentage(context);
          explanation = this.getPercentageExplanation(result);
          break;
          
        case 'prorated_calculation':
          result = this.calculateProrated(context);
          explanation = this.getProratedExplanation(result);
          break;
          
        case 'time_calculation':
          result = this.calculateTime(context);
          explanation = this.getTimeExplanation(result);
          break;
          
        case 'monthly_working_days':
          result = this.calculateMonthlyWorkingDaysResult(context);
          explanation = this.getMonthlyWorkingDaysExplanation(result);
          break;
          
        default:
          result = this.calculateGeneral(expression);
          explanation = `Calculation: ${expression} = ${result}`;
      }

      return {
        success: true,
        result: result,
        explanation: explanation,
        expression: expression,
        type: type,
        context: context
      };

    } catch (error) {
      console.error('Calculator error:', error);
      return {
        success: false,
        error: error.message,
        result: null,
        explanation: null
      };
    }
  }

  // General mathematical calculations
  calculateGeneral(expression) {
    // Sanitize expression to prevent code injection
    const sanitizedExpression = expression.replace(/[^0-9+\-*/().%\s]/g, '');
    
    // Basic safety check
    if (sanitizedExpression.length === 0) {
      throw new Error('Invalid expression');
    }

    try {
      // Use Function constructor for safe evaluation
      const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
      return parseFloat(result.toFixed(10)); // Limit decimal places
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  }

  // Calculate vacation days scenarios
  calculateVacationDays(context) {
    const { 
      currentBalance, 
      daysToTake, 
      accrualRate, 
      payPeriods,
      startDate,
      endDate 
    } = context;

    const result = {};

    // Calculate remaining balance after taking time off
    if (currentBalance !== undefined && daysToTake !== undefined) {
      result.remaining_balance = currentBalance - daysToTake;
      result.sufficient_balance = result.remaining_balance >= 0;
      result.deficit = result.remaining_balance < 0 ? Math.abs(result.remaining_balance) : 0;
    }

    // Calculate accrual if rate provided
    if (accrualRate !== undefined && payPeriods !== undefined) {
      result.accrual_amount = accrualRate * payPeriods;
      result.projected_balance = currentBalance + result.accrual_amount - (daysToTake || 0);
    }

    // Calculate working days between dates
    if (startDate && endDate) {
      result.working_days = this.calculateWorkingDays(startDate, endDate);
    }

    return result;
  }

  // Calculate percentages
  calculatePercentage(context) {
    const { value, total, percentage } = context;
    
    const result = {};

    if (value !== undefined && total !== undefined) {
      result.percentage = (value / total) * 100;
      result.formatted_percentage = result.percentage.toFixed(2) + '%';
    }

    if (percentage !== undefined && total !== undefined) {
      result.value = (percentage / 100) * total;
    }

    if (percentage !== undefined && value !== undefined) {
      result.total = value / (percentage / 100);
    }

    return result;
  }

  // Calculate prorated amounts
  calculateProrated(context) {
    const { 
      annualAmount, 
      daysWorked, 
      totalDays = 365,
      startDate,
      endDate 
    } = context;

    const result = {};

    if (annualAmount !== undefined && daysWorked !== undefined) {
      result.prorated_amount = (annualAmount / totalDays) * daysWorked;
      result.daily_rate = annualAmount / totalDays;
    }

    if (startDate && endDate && annualAmount !== undefined) {
      const days = this.calculateDaysBetween(startDate, endDate);
      result.prorated_amount = (annualAmount / totalDays) * days;
      result.days_calculated = days;
    }

    return result;
  }

  // Calculate time-related values
  calculateTime(context) {
    const { 
      hoursPerDay = 8,
      daysPerWeek = 5,
      weeksPerYear = 52,
      totalHours,
      totalDays 
    } = context;

    const result = {};

    if (totalHours !== undefined) {
      result.days = totalHours / hoursPerDay;
      result.weeks = result.days / daysPerWeek;
    }

    if (totalDays !== undefined) {
      result.hours = totalDays * hoursPerDay;
      result.weeks = totalDays / daysPerWeek;
    }

    result.annual_hours = hoursPerDay * daysPerWeek * weeksPerYear;
    result.annual_days = daysPerWeek * weeksPerYear;

    return result;
  }

  // Calculate working days between two dates
  calculateWorkingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      // Monday = 1, Friday = 5
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    return workingDays;
  }

  // Calculate working days for a specific month and year
  calculateMonthlyWorkingDays(month, year) {
    // Create start date (first day of month)
    const startDate = new Date(year, month - 1, 1);
    // Create end date (last day of month)
    const endDate = new Date(year, month, 0);
    
    let workingDays = 0;

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      // Monday = 1, Friday = 5 (weekends are 0=Sunday, 6=Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    return workingDays;
  }

  // Calculate monthly working days result object
  calculateMonthlyWorkingDaysResult(context) {
    const { month, year } = context;
    
    if (!month || !year) {
      throw new Error('Month and year are required for monthly working days calculation');
    }

    const workingDays = this.calculateMonthlyWorkingDays(month, year);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      month: month,
      year: year,
      monthName: monthNames[month - 1],
      workingDays: workingDays
    };
  }

  // Calculate total days between two dates
  calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Generate explanations for different calculation types
  getVacationCalculationExplanation(result) {
    let explanation = '';

    if (result.remaining_balance !== undefined) {
      explanation += `After taking ${result.daysToTake || 0} days off, you would have ${result.remaining_balance} vacation days remaining. `;
      
      if (!result.sufficient_balance) {
        explanation += `You would need ${result.deficit} additional days to cover this request. `;
      }
    }

    if (result.accrual_amount !== undefined) {
      explanation += `You accrue ${result.accrual_amount} vacation days over this period. `;
    }

    if (result.working_days !== undefined) {
      explanation += `This spans ${result.working_days} working days. `;
    }

    return explanation.trim();
  }

  getPercentageExplanation(result) {
    let explanation = '';

    if (result.percentage !== undefined) {
      explanation += `This represents ${result.formatted_percentage} of the total. `;
    }

    if (result.value !== undefined) {
      explanation += `The calculated value is ${result.value}. `;
    }

    return explanation.trim();
  }

  getProratedExplanation(result) {
    let explanation = '';

    if (result.prorated_amount !== undefined) {
      explanation += `The prorated amount is ${result.prorated_amount.toFixed(2)}. `;
    }

    if (result.daily_rate !== undefined) {
      explanation += `Daily rate: ${result.daily_rate.toFixed(2)}. `;
    }

    return explanation.trim();
  }

  getTimeExplanation(result) {
    let explanation = '';

    if (result.hours !== undefined) {
      explanation += `${result.hours} hours equals ${result.days} days. `;
    }

    if (result.weeks !== undefined) {
      explanation += `This is approximately ${result.weeks.toFixed(2)} weeks. `;
    }

    return explanation.trim();
  }

  getMonthlyWorkingDaysExplanation(result) {
    return `In ${result.monthName} ${result.year}, there are ${result.workingDays} working days. This calculation assumes that weekends (Saturdays and Sundays) are not considered working days. If there are any public holidays that month, they have not been accounted for in this calculation. Please adjust accordingly for any holidays specific to your location or company policy.`;
  }

  // Get function definition for OpenAI
  getFunctionDefinition() {
    return {
      name: this.name,
      description: this.description,
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Mathematical expression to evaluate (e.g., "15 + 3 * 2")'
          },
          type: {
            type: 'string',
            enum: ['general', 'vacation_calculation', 'percentage', 'prorated_calculation', 'time_calculation', 'monthly_working_days'],
            description: 'Type of calculation to perform'
          },
          context: {
            type: 'object',
            properties: {
              currentBalance: { type: 'number', description: 'Current vacation balance' },
              daysToTake: { type: 'number', description: 'Days to take off' },
              accrualRate: { type: 'number', description: 'Vacation accrual rate per pay period' },
              payPeriods: { type: 'number', description: 'Number of pay periods' },
              startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
              endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
              value: { type: 'number', description: 'Value for percentage calculation' },
              total: { type: 'number', description: 'Total for percentage calculation' },
              percentage: { type: 'number', description: 'Percentage value' },
              annualAmount: { type: 'number', description: 'Annual amount for proration' },
              daysWorked: { type: 'number', description: 'Days worked for proration' },
              totalDays: { type: 'number', description: 'Total days in period' },
              hoursPerDay: { type: 'number', description: 'Hours per day' },
              daysPerWeek: { type: 'number', description: 'Days per week' },
              totalHours: { type: 'number', description: 'Total hours' },
              totalDays: { type: 'number', description: 'Total days' },
              month: { type: 'number', description: 'Month number (1-12) for monthly working days calculation' },
              year: { type: 'number', description: 'Year for monthly working days calculation' }
            },
            description: 'Context for specialized calculations'
          }
        },
        required: []
      }
    };
  }
}

module.exports = CalculatorTool; 