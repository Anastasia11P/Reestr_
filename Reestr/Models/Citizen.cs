using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Reestr.Models
{
    [Table("citizens")]
    public class Citizen
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("lastname")]
        public string LastName { get; set; }
        [Column("firstname")]
        public string FirstName { get; set; }
        [Column("patronymic")]
        public string Patronymic { get; set; }
        [Column("dateofbirth")]
        public DateTime DateOfBirth { get; set; }
    }
}