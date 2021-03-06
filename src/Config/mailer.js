const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'popinshopmotdepasse@gmail.com', //email
        pass: 'A$.rXtr0l?Dd' // password
    }
});

let sendMail = (mailOptions)=> {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("error: ", error);
        } else {
            return console.log("sent: ", info);
        }
    });
    transporter.close();
};

let sendCredentials = (email, password) => {
    let credentialsOptions = {
        from: "CoproVisit.fr <contact@cantem.fr>", // sender address
        to: email,  // to Client
        subject: "Identifiants de connexions",
        html: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" +
            "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\">" +
            " <head> " +
            "  <meta charset=\"UTF-8\"> " +
            "  <meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"> " +
            "  <meta name=\"x-apple-disable-message-reformatting\"> " +
            "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> " +
            "  <meta content=\"telephone=no\" name=\"format-detection\"> " +
            "  <title>coprovisit login</title> " +
            "  <!--[if (mso 16)]>" +
            "    <style type=\"text/css\">" +
            "    a {text-decoration: none;}" +
            "    </style>" +
            "    <![endif]--> " +
            "  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> " +
            "  <!--[if gte mso 9]>" +
            "<xml>" +
            "    <o:OfficeDocumentSettings>" +
            "    <o:AllowPNG></o:AllowPNG>" +
            "    <o:PixelsPerInch>96</o:PixelsPerInch>" +
            "    </o:OfficeDocumentSettings>" +
            "</xml>" +
            "<![endif]--> " +
            "  <style type=\"text/css\">" +
            "@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120% } h2 { font-size:26px!important; text-align:center; line-height:120% } h3 { font-size:20px!important; text-align:center; line-height:120% } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class=\"gmail-fix\"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }" +
            "#outlook a {" +
            "padding:0;" +
            "}" +
            ".ExternalClass {" +
            "width:100%;" +
            "}" +
            ".ExternalClass," +
            ".ExternalClass p," +
            ".ExternalClass span," +
            ".ExternalClass font," +
            ".ExternalClass td," +
            ".ExternalClass div {" +
            "line-height:100%;" +
            "}" +
            ".es-button {" +
            "mso-style-priority:100!important;" +
            "text-decoration:none!important;" +
            "}" +
            "a[x-apple-data-detectors] {" +
            "color:inherit!important;" +
            "text-decoration:none!important;" +
            "font-size:inherit!important;" +
            "font-family:inherit!important;" +
            "font-weight:inherit!important;" +
            "line-height:inherit!important;" +
            "}" +
            ".es-desk-hidden {" +
            "display:none;" +
            "float:left;" +
            "overflow:hidden;" +
            "width:0;" +
            "max-height:0;" +
            "line-height:0;" +
            "mso-hide:all;" +
            "}" +
            "</style> " +
            " </head> " +
            " <body style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\"> " +
            "  <div class=\"es-wrapper-color\" style=\"background-color:#F6F6F6\"> " +
            "   <!--[if gte mso 9]>" +
            "<v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\">" +
            "<v:fill type=\"tile\" color=\"#f6f6f6\"></v:fill>" +
            "</v:background>" +
            "<![endif]--> " +
            "   <table class=\"es-wrapper\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top\"> " +
            "     <tr style=\"border-collapse:collapse\"> " +
            "      <td valign=\"top\" style=\"padding:0;Margin:0\"> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-footer\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-footer-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"left\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0;font-size:0px\"><img src=\"https://iihazn.stripocdn.email/content/guids/CABINET_8f4baa897a3a85f4dfe93432a7fae22a/images/30411595024014526.jpeg\" alt style=\"display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic\" width=\"560\" height=\"294\"></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:36px;color:#333333\"><strong>Coprovisit</strong></p></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333\">Veuillez trouver, ci dessous, vos identifiants de connexion:</p></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:28px;color:#333333\">email: "+email+"<br>mot de passe: "+password+"<br></p></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td class=\"es-info-area\" align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" class=\"es-infoblock\" style=\"padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC\">Coprovisit.fr © 2020, tout droit réservé&nbsp;</p></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table></td> " +
            "     </tr> " +
            "   </table> " +
            "  </div>  " +
            " </body>" +
            "</html>"
    }
    sendMail(credentialsOptions)
}

let sendDemandeCourtier = (body) => {
    let credentialsOptions = {
        from: "CoproVisit.fr <contact@cantem.fr>", // sender address
        to: 'seif.habbachi@cantem.fr',  // to admin
        subject: "demande création de Courtier",
        html: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" +
            "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\">" +
            " <head> " +
            "  <meta charset=\"UTF-8\"> " +
            "  <meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"> " +
            "  <meta name=\"x-apple-disable-message-reformatting\"> " +
            "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> " +
            "  <meta content=\"telephone=no\" name=\"format-detection\"> " +
            "  <title>demande création courtier</title> " +
            "  <!--[if (mso 16)]>" +
            "    <style type=\"text/css\">" +
            "    a {text-decoration: none;}" +
            "    </style>" +
            "    <![endif]--> " +
            "  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> " +
            "  <!--[if gte mso 9]>" +
            "<xml>" +
            "    <o:OfficeDocumentSettings>" +
            "    <o:AllowPNG></o:AllowPNG>" +
            "    <o:PixelsPerInch>96</o:PixelsPerInch>" +
            "    </o:OfficeDocumentSettings>" +
            "</xml>" +
            "<![endif]--> " +
            "  <style type=\"text/css\">" +
            "#outlook a {" +
            "padding:0;" +
            "}" +
            ".ExternalClass {" +
            "width:100%;" +
            "}" +
            ".ExternalClass," +
            ".ExternalClass p," +
            ".ExternalClass span," +
            ".ExternalClass font," +
            ".ExternalClass td," +
            ".ExternalClass div {" +
            "line-height:100%;" +
            "}" +
            ".es-button {" +
            "mso-style-priority:100!important;" +
            "text-decoration:none!important;" +
            "}" +
            "a[x-apple-data-detectors] {" +
            "color:inherit!important;" +
            "text-decoration:none!important;" +
            "font-size:inherit!important;" +
            "font-family:inherit!important;" +
            "font-weight:inherit!important;" +
            "line-height:inherit!important;" +
            "}" +
            ".es-desk-hidden {" +
            "display:none;" +
            "float:left;" +
            "overflow:hidden;" +
            "width:0;" +
            "max-height:0;" +
            "line-height:0;" +
            "mso-hide:all;" +
            "}" +
            "@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120% } h2 { font-size:26px!important; text-align:center; line-height:120% } h3 { font-size:20px!important; text-align:center; line-height:120% } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class=\"gmail-fix\"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }" +
            "</style> " +
            " </head> " +
            " <body style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\"> " +
            "  <div class=\"es-wrapper-color\" style=\"background-color:#F6F6F6\"> " +
            "   <!--[if gte mso 9]>" +
            "<v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\">" +
            "<v:fill type=\"tile\" color=\"#f6f6f6\"></v:fill>" +
            "</v:background>" +
            "<![endif]--> " +
            "   <table class=\"es-wrapper\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top\"> " +
            "     <tr style=\"border-collapse:collapse\"> " +
            "      <td valign=\"top\" style=\"padding:0;Margin:0\"> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-footer\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-footer-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"left\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0;font-size:0px\"><img class=\"adapt-img\" src=\"https://iihazn.stripocdn.email/content/guids/CABINET_85f2e21e559bd95b3807017058de7f6e/images/10781594059702555.jpg\" alt style=\"display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic\" width=\"560\" height=\"324\"></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:17px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:26px;color:#0000CD\"><b>Le Syndic ("+body.nomSyndic+") a fait une demande de création de Courtier</b></p></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:20px;Margin:0;font-size:0\"> " +
            "                       <table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px\"></td> " +
            "                         </tr> " +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:600px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "                       <table border=\"1\" cellspacing=\"1\" cellpadding=\"1\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:500px\" role=\"presentation\"> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>nom responsable<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.lastName+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>prenom responsable<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.firstName+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>email<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><strong>"+body.email+"</strong></td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>Telephone<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.phone+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>entreprise<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.company+"</td> " +
            "                         </tr> " +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:20px;Margin:0;font-size:0\"> " +
            "                       <table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px\"></td> " +
            "                         </tr> " +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table></td> " +
            "     </tr> " +
            "   </table> " +
            "  </div>  " +
            " </body>" +
            "</html>"
    }
    sendMail(credentialsOptions)
}

let sendDemandePrestataire = (body) => {
    let corpsEtats = "";
    body.corpsEtat.map(item => corpsEtats +=  "<tr style=\"border-collapse:collapse\"><td style=\"padding:0;Margin:0;text-align:center\"><br>"+item+"<br><br></td></tr> ")
    let credentialsOptions = {
        from: "CoproVisit.fr <contact@cantem.fr>", // sender address
        to: 'seif.habbachi@cantem.fr',  // to admin
        subject: "demande création de Prestataire",
        html: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" +
            "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\">" +
            " <head> " +
            "  <meta charset=\"UTF-8\"> " +
            "  <meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"> " +
            "  <meta name=\"x-apple-disable-message-reformatting\"> " +
            "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> " +
            "  <meta content=\"telephone=no\" name=\"format-detection\"> " +
            "  <title>demande création prestataire</title> " +
            "  <!--[if (mso 16)]>" +
            "    <style type=\"text/css\">" +
            "    a {text-decoration: none;}" +
            "    </style>" +
            "    <![endif]--> " +
            "  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> " +
            "  <!--[if gte mso 9]>" +
            "<xml>" +
            "    <o:OfficeDocumentSettings>" +
            "    <o:AllowPNG></o:AllowPNG>" +
            "    <o:PixelsPerInch>96</o:PixelsPerInch>" +
            "    </o:OfficeDocumentSettings>" +
            "</xml>" +
            "<![endif]--> " +
            "  <style type=\"text/css\">" +
            "#outlook a {" +
            "padding:0;" +
            "}" +
            ".ExternalClass {" +
            "width:100%;" +
            "}" +
            ".ExternalClass," +
            ".ExternalClass p," +
            ".ExternalClass span," +
            ".ExternalClass font," +
            ".ExternalClass td," +
            ".ExternalClass div {" +
            "line-height:100%;" +
            "}" +
            ".es-button {" +
            "mso-style-priority:100!important;" +
            "text-decoration:none!important;" +
            "}" +
            "a[x-apple-data-detectors] {" +
            "color:inherit!important;" +
            "text-decoration:none!important;" +
            "font-size:inherit!important;" +
            "font-family:inherit!important;" +
            "font-weight:inherit!important;" +
            "line-height:inherit!important;" +
            "}" +
            ".es-desk-hidden {" +
            "display:none;" +
            "float:left;" +
            "overflow:hidden;" +
            "width:0;" +
            "max-height:0;" +
            "line-height:0;" +
            "mso-hide:all;" +
            "}" +
            "@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120% } h2 { font-size:26px!important; text-align:center; line-height:120% } h3 { font-size:20px!important; text-align:center; line-height:120% } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class=\"gmail-fix\"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }" +
            "</style> " +
            " </head> " +
            " <body style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\"> " +
            "  <div class=\"es-wrapper-color\" style=\"background-color:#F6F6F6\"> " +
            "   <!--[if gte mso 9]>" +
            "<v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\">" +
            "<v:fill type=\"tile\" color=\"#f6f6f6\"></v:fill>" +
            "</v:background>" +
            "<![endif]--> " +
            "   <table class=\"es-wrapper\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top\"> " +
            "     <tr style=\"border-collapse:collapse\"> " +
            "      <td valign=\"top\" style=\"padding:0;Margin:0\"> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-footer\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-footer-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"left\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0;font-size:0px\"><img class=\"adapt-img\" src=\"https://iihazn.stripocdn.email/content/guids/CABINET_dec849865294edd397c4ecb293d9406d/images/10781594059702555.jpg\" alt style=\"display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic\" width=\"560\" height=\"324\"></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:17px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:26px;color:#0000CD\"><b>Le Syndic <span style=\"color:#FF8C00\">"+body.nomSyndic+"</span>&nbsp;a fait une demande de création de <span style=\"color:#FF8C00\">Prestataire</span></b></p></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:20px;Margin:0;font-size:0\"> " +
            "                       <table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px\"></td> " +
            "                         </tr> " +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:600px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"left\" style=\"padding:0;Margin:0\"> " +
            "                       <table border=\"1\" align=\"center\" cellspacing=\"1\" cellpadding=\"1\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;height:100px;width:500px\" role=\"presentation\"> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>Email du compte<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.email+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>N° téléphone<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.phone+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>N° et nom de rue<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.address+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>Code postal&nbsp;<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.codePostal+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>Nom/raison sociale<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.company+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>Nom du représentant<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">john doe</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>N° SIRET<br><br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.siret+"</td> " +
            "                         </tr> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\"><br>Nombre de salariés<br></td> " +
            "                          <td style=\"padding:0;Margin:0;text-align:center\">"+body.nbSalaries+"</td> " +
            "                         </tr> " +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:0;Margin:0\"><p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333\"><br></p> " +
            "                       <table border=\"1\" cellspacing=\"1\" cellpadding=\"1\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:500px\" role=\"presentation\"> " +
            "                        <caption> " +
            "                         <strong>Corps d'État</strong> " +
            "                        </caption> " +
            corpsEtats +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table> " +
            "       <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%\"> " +
            "         <tr style=\"border-collapse:collapse\"> " +
            "          <td align=\"center\" style=\"padding:0;Margin:0\"> " +
            "           <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px\"> " +
            "             <tr style=\"border-collapse:collapse\"> " +
            "              <td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px\"> " +
            "               <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                 <tr style=\"border-collapse:collapse\"> " +
            "                  <td align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;width:560px\"> " +
            "                   <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                     <tr style=\"border-collapse:collapse\"> " +
            "                      <td align=\"center\" style=\"padding:20px;Margin:0;font-size:0\"> " +
            "                       <table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px\"> " +
            "                         <tr style=\"border-collapse:collapse\"> " +
            "                          <td style=\"padding:0;Margin:0;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px\"></td> " +
            "                         </tr> " +
            "                       </table></td> " +
            "                     </tr> " +
            "                   </table></td> " +
            "                 </tr> " +
            "               </table></td> " +
            "             </tr> " +
            "           </table></td> " +
            "         </tr> " +
            "       </table></td> " +
            "     </tr> " +
            "   </table> " +
            "  </div>  " +
            " </body>" +
            "</html>",
    };
    sendMail(credentialsOptions)
}

module.exports = {
    sendCredentials,
    sendDemandeCourtier,
    sendDemandePrestataire,
}
