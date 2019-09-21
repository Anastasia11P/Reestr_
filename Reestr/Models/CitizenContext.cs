using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Web;

namespace Reestr.Models
{

        public class CitizenContext : Microsoft.EntityFrameworkCore.DbContext
        {
            public Microsoft.EntityFrameworkCore.DbSet<Citizen> Citizens { get; set; }
        
        public CitizenContext(DbContextOptions<CitizenContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

    }

}