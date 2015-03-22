using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SvitlaFolio_v_1._0._0.Models
{
    public class SendEmailModel
    {
        public static string To = "koltsova1111@gmail.com";
        public static string Subject = "SvitlaFolio Email " + DateTime.Now.ToLongDateString();
        [Required]
        [Display(Name = "Full name")]
        public string FullName { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; }
    }
}