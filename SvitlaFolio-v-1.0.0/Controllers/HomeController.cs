using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ActionMailer.Net.Mvc4;
using SvitlaFolio_v_1._0._0.Models;

namespace SvitlaFolio_v_1._0._0.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "SvitlaFolio Index page";
            return View();
        }

        public ActionResult Portfolio()
        {
            ViewBag.Message = "SvitlaFolio Portfolio page";
            return View();
        }

        public ActionResult Preview()
        {
            ViewBag.Message = "SvitlaFolio Preview page";
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "SvitlaFolio About page";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "SvitlaFolio Contact page";
            return View();
        }

        [HttpPost]
        public ActionResult SendEmail(SendEmailModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    new EmailController().SendEmail(model).Deliver();
                    return RedirectToAction("Success");
                }
                catch (Exception)
                {
                    return RedirectToAction("Error");
                }
            }
            return View(model);
        }

        public ActionResult Success()
        {
            return View();
        }

        public ActionResult Error()
        {
            return View();
        }
    }
}