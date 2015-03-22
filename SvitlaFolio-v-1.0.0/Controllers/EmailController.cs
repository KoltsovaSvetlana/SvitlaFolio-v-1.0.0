using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mail;
using System.Web.Mvc;
using ActionMailer.Net.Mvc4;
using SvitlaFolio_v_1._0._0.Models;

namespace SvitlaFolio_v_1._0._0.Controllers
{
    public class EmailController : MailerBase
    {
        public EmailResult SendEmail(SendEmailModel model)
        {
            To.Add(SendEmailModel.To);
            From = model.Email;
            Subject = SendEmailModel.Subject + " from " + model.FullName;

            return Email("SendEmail", model);
        }
    }
}
