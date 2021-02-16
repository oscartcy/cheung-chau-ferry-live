// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: ship;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple icon-glyph: newspaper
// The script shows the latest article
// from MacStories in a widget on your
// Home screen. Go to your Home screen
// to set up the script in a widget.
// The script will present a preview
// of the widget when running in the
// app.
let cToCcData = await loadFerries('http://www.nwff.com.hk/boarding_status/pax4_cp5.json')
let ccToCData = await loadFerries('http://www.nwff.com.hk/boarding_status/pax4_chc.json')

let ferries = {}
ferries = Object.assign(ferries, cToCcData)
ferries = Object.assign(ferries, ccToCData)
delete ferries["undefined"]

console.log(ferries)

let routeCodeMap = {
  "CECC": "慢船",
  "CECCH": "快船"
}

let widget = await createWidget(ferries)
// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentSmall()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()

async function createWidget(ferries) {
  let imgURL = null
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("#1F1F34"),
    new Color("#1A1A27")
  ]
  let w = new ListWidget()
  if (imgURL != null) {
    let imgReq = new Request(imgURL)
    let img = await imgReq.loadImage()
    w.backgroundImage = img
  }
  w.backgroundColor = new Color("#1A1A27")
  w.backgroundGradient = gradient
  // Add spacer above content to center it vertically.
  w.addSpacer()
  // Show article headline.
  let cToCc = w.addText('中環 -> 長洲')
  cToCc.font = Font.boldSystemFont(16)
  cToCc.textColor = new Color("#C25924")
  // Add spacing below headline.
  w.addSpacer(8)

  if(ferries['CECC'] != null) {
    displayFerry(w, '慢船', ferries['CECC'].ORDcmsg)
  }

  if(ferries['CECCH'] != null) {
    displayFerry(w, '快船', ferries['CECCH'].DELcmsg)
  }
  w.addSpacer(8)

  let ccToc = w.addText('長洲 -> 中環')
  ccToc.font = Font.boldSystemFont(16)
  ccToc.textColor = new Color("#C25924")
  // Add spacing below headline.
  w.addSpacer(8)

  if(ferries['CCCE'] != null) {
    displayFerry(w, '慢船', ferries['CCCE'].ORDcmsg)
  }

  if(ferries['CCCEH'] != null) {
    displayFerry(w, '快船', ferries['CCCEH'].DELcmsg)
  }

  if(Object.keys(ferries).length > 0) {
    let dateTxt = w.addText(ferries[Object.keys(ferries)[0]].lastupdatetime)
    dateTxt.font = Font.mediumSystemFont(10)
    dateTxt.textColor = Color.white()
    dateTxt.textOpacity = 0.3
  }

  return w
}
  
async function loadFerries(url) {
  let req = new Request(url)
  let json = await req.loadJSON()
  return processRawFerryData(json)
}

function processRawFerryData(rawData) {
  let res = {}
  rawData.forEach((data) => {
    res[data.routecode] = data
  })

  return res
}

function displayFerry(w, ferryType, message){
  let display = ferryType + ' ' + message.replace('普通位船票剩餘少於', '<').replace('船票剩餘少於', '<')
  let authorsTxt = w.addText(display)
  authorsTxt.font = Font.mediumSystemFont(12)
  authorsTxt.textColor = Color.white()
  authorsTxt.textOpacity = 0.9
  w.addSpacer(2)
}