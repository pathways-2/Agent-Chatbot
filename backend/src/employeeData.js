const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class EmployeeDataProcessor {
  constructor() {
    this.employees = [];
    this.isLoaded = false;
    this.loadEmployeeData();
  }

  async loadEmployeeData() {
    try {
      const csvPath = path.join(__dirname, '../data/employee_data.csv');
      const employees = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (row) => {
            employees.push(row);
          })
          .on('end', () => {
            this.employees = employees;
            this.isLoaded = true;
            console.log(`Loaded ${employees.length} employee records`);
            resolve();
          })
          .on('error', (error) => {
            console.error('Error loading employee data:', error);
            reject(error);
          });
      });
    } catch (error) {
      console.error('Error loading employee data:', error);
      throw error;
    }
  }

  // Search for employees by name (supports partial matches)
  searchByName(name) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    const searchTerm = name.toLowerCase().trim();
    const results = [];

    for (const employee of this.employees) {
      const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
      const firstName = employee.first_name.toLowerCase();
      const lastName = employee.last_name.toLowerCase();

      // Exact match gets highest priority
      if (fullName === searchTerm) {
        results.unshift(employee);
      }
      // Partial matches
      else if (
        fullName.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm)
      ) {
        results.push(employee);
      }
    }

    return results;
  }

  // Search by employee ID
  searchById(id) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    const employee = this.employees.find(emp => emp.employee_id === id.toString());
    return employee || null;
  }

  // Search by email
  searchByEmail(email) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    const employee = this.employees.find(emp => 
      emp.email.toLowerCase() === email.toLowerCase()
    );
    return employee || null;
  }

  // Search by department
  searchByDepartment(department) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    return this.employees.filter(emp => 
      emp.department.toLowerCase().includes(department.toLowerCase())
    );
  }

  // Search by job title
  searchByJobTitle(jobTitle) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    return this.employees.filter(emp => 
      emp.job_title.toLowerCase().includes(jobTitle.toLowerCase())
    );
  }

  // Search by supervisor
  searchBySupervisor(supervisorName) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    return this.employees.filter(emp => 
      emp.supervisor_name.toLowerCase().includes(supervisorName.toLowerCase())
    );
  }

  // Multi-field search
  searchMultiple(criteria) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    let results = [...this.employees];

    if (criteria.name) {
      const nameResults = this.searchByName(criteria.name);
      results = results.filter(emp => nameResults.includes(emp));
    }

    if (criteria.department) {
      results = results.filter(emp => 
        emp.department.toLowerCase().includes(criteria.department.toLowerCase())
      );
    }

    if (criteria.jobTitle) {
      results = results.filter(emp => 
        emp.job_title.toLowerCase().includes(criteria.jobTitle.toLowerCase())
      );
    }

    if (criteria.location) {
      results = results.filter(emp => 
        emp.location.toLowerCase().includes(criteria.location.toLowerCase())
      );
    }

    return results;
  }

  // Get employee vacation balance
  getVacationBalance(employeeId) {
    const employee = this.searchById(employeeId);
    if (!employee) return null;

    return {
      employee_id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      vacation_balance: parseFloat(employee.vacation_balance),
      sick_balance: parseFloat(employee.sick_balance),
      personal_balance: parseFloat(employee.personal_balance)
    };
  }

  // Calculate remaining vacation days after taking time off
  calculateVacationAfterLeave(employeeId, daysToTake) {
    const employee = this.searchById(employeeId);
    if (!employee) return null;

    const currentBalance = parseFloat(employee.vacation_balance);
    const remainingDays = currentBalance - daysToTake;

    return {
      employee_id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      current_balance: currentBalance,
      days_to_take: daysToTake,
      remaining_balance: remainingDays,
      sufficient_balance: remainingDays >= 0
    };
  }

  // Get employee benefits information
  getBenefitsInfo(employeeId) {
    const employee = this.searchById(employeeId);
    if (!employee) return null;

    return {
      employee_id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      benefits_eligible: employee.benefits_eligible,
      health_insurance: employee.health_insurance,
      dental_insurance: employee.dental_insurance,
      vision_insurance: employee.vision_insurance,
      life_insurance: employee.life_insurance,
      disability_insurance: employee.disability_insurance,
      retirement_plan: employee.retirement_plan
    };
  }

  // Get employee performance information
  getPerformanceInfo(employeeId) {
    const employee = this.searchById(employeeId);
    if (!employee) return null;

    return {
      employee_id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      last_performance_review: employee.last_performance_review,
      performance_rating: employee.performance_rating,
      next_review_date: employee.next_review_date
    };
  }

  // Format employee data for display (removes sensitive information)
  formatEmployeeForDisplay(employee) {
    if (!employee) return null;

    return {
      employee_id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      department: employee.department,
      job_title: employee.job_title,
      supervisor: employee.supervisor_name,
      employment_status: employee.employment_status,
      hire_date: employee.hire_date,
      employment_type: employee.employment_type,
      location: employee.location,
      phone: employee.phone,
      emergency_contact: employee.emergency_contact,
      emergency_phone: employee.emergency_phone,
      vacation_balance: employee.vacation_balance,
      sick_balance: employee.sick_balance,
      personal_balance: employee.personal_balance,
      benefits_eligible: employee.benefits_eligible,
      performance_rating: employee.performance_rating,
      next_review_date: employee.next_review_date
    };
  }

  // Format multiple employees for display
  formatMultipleEmployees(employees) {
    return employees.map(emp => this.formatEmployeeForDisplay(emp));
  }

  // Get department statistics
  getDepartmentStats() {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    const departments = {};
    
    this.employees.forEach(emp => {
      const dept = emp.department;
      if (!departments[dept]) {
        departments[dept] = {
          total_employees: 0,
          full_time: 0,
          part_time: 0,
          active: 0
        };
      }
      
      departments[dept].total_employees++;
      if (emp.employment_type === 'Full-time') {
        departments[dept].full_time++;
      } else {
        departments[dept].part_time++;
      }
      if (emp.employment_status === 'Active') {
        departments[dept].active++;
      }
    });

    return departments;
  }

  // Smart search that tries to detect what the user is looking for
  smartSearch(query) {
    if (!this.isLoaded) {
      throw new Error('Employee data not loaded');
    }

    const results = {
      employees: [],
      type: 'unknown'
    };

    // Check if it's an employee ID
    if (/^\d+$/.test(query)) {
      const employee = this.searchById(query);
      if (employee) {
        results.employees = [employee];
        results.type = 'employee_id';
        return results;
      }
    }

    // Check if it's an email
    if (query.includes('@')) {
      const employee = this.searchByEmail(query);
      if (employee) {
        results.employees = [employee];
        results.type = 'email';
        return results;
      }
    }

    // Check if it's a name (contains space and capital letters)
    if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(query)) {
      const employees = this.searchByName(query);
      if (employees.length > 0) {
        results.employees = employees;
        results.type = 'name';
        return results;
      }
    }

    // Check if it's a department
    const deptEmployees = this.searchByDepartment(query);
    if (deptEmployees.length > 0) {
      results.employees = deptEmployees;
      results.type = 'department';
      return results;
    }

    // Check if it's a job title
    const jobEmployees = this.searchByJobTitle(query);
    if (jobEmployees.length > 0) {
      results.employees = jobEmployees;
      results.type = 'job_title';
      return results;
    }

    // Fallback to name search
    const nameEmployees = this.searchByName(query);
    if (nameEmployees.length > 0) {
      results.employees = nameEmployees;
      results.type = 'name_partial';
      return results;
    }

    return results;
  }
}

module.exports = EmployeeDataProcessor; 