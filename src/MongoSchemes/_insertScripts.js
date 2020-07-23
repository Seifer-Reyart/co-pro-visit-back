/*****************************************************/
/* Insert Event Definistions in eventdefs collection */
/*****************************************************/

let conn = new Mongo();
//db.aouth()
let db = conn.getDB("coprovisit");

/* initialize admin */

let bulk = db.eventdefs.initializeUnorderedBulkOp();

bulk.insert({ "eventId": 0x00000011, "category": "sas", "description": "Slot door was opened ", "isLogged": true });


bulk.execute();
