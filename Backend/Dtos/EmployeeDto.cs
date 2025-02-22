public class EmployeeDto
{
    public int EmployeeID { get; set; }
    public string EmployeeReferenceID { get; set; }
    public string CompanyEmailAddress { get; set; }
    public string Role { get; set; }
    public int? SupervisorID { get; set; } // Only store SupervisorID, not full object
}