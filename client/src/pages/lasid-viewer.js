import Head from 'next/head';
import styles from '@styles/Home.module.scss';
import { useState, useEffect } from 'react';


export default function Home() {
  const [currentMap, setCurrentMap] = useState("0");
  const [currentMapData, setCurrentMapData] = useState([]);
  const [textSize, setTextSize] = useState(20);
  const [simplifiedView, setSimplifiedView] = useState(false);

  const english_words = ["i sold", "cattle", "cow", "bulls", "tail", "castrating vn.", "slime as of cow in heat", "bullock", "calf", "the cow is in heat", "heifer", "thieving", "agut prep pron 2p sg", "aca ocu prep pron 3p pl", "barking", "chewing the cud", "horn of cow", "sick", "tied", "i shall tie", "grazing", "calling", "teats of cow's udder", "milking", "new milk", "churn", "butter", "churn-dash", "vessel", "choice", "do you want", "anything", "sheep sg", "lamb", "ram", "sheep shears", "astray", "smothered v. adj.", "goat", "he-goat", "helping vn.", "boar", "suckling pigs", "rooting", "smallest pigling of a litter",
    "chickens", "plumage as of hens", "feathers", "[the fox] killed", "he will kill", "at the gate", "more", "dozen", "cock", "fox", "wings", "geese", "egg (sg.)", "egg (gen. sg.)", "eggs (pl.)", "a soft egg", "[he is] as cute [as a fox]", "duck", "bee", "we bought", "i shall buy", "horse", "mare", "foal (sg.)", "foals (pl.)", "mane (of the horse)", "running", "dog", "horse shoes", "pannier-baskets", "shooting", "rubbing", "sewing vn.", "thimble", "slippery", "knitting", "digging", "hole sg.", "holes pl.", "knitting needle", "at all", "spinning-wheel", "tongue", "soap", "cabbage", "he thinks [that i am a fool]", "fart",
    "floor", "bread", "loaf", "[he] was found", "pot", "new", "dreaming vn", "on the road", "light", "heavy", "we get 1 pl. pres.", "dirty", "suit of clothes", "also", "you will get", "sleeve", "food", "scarce", "too much", "did you eat? [i did not eat]", "your fill", "pennies", "something", "earning vn", "half-crown", "empty", "sugar", "porridge", "much", "brother", "(give me something) to eat", "sister", "game", "daughter", "grandmother", "people (of ireland)", "ten (people)", "deep", "woman", "talking", "many an (irishman went to america)", "harm", "england", "irish", "complaining", "neck", "face", "forehead", "did you hear?", "hearing", "head gen. sg.", "head nom. sg.", "before i go", "deaf", "glass",
    "i shall see", "blind", "seeing", "looking", "sight", "snoring", "fool", "toothache", "did you feel, do you feel", "bones pl.", "back", "hip(s)", "thumb", "barefooted", "finger-nails pl.", "we (i) shall wash", "throat", "liver", "lungs", "bed", "what is on your mind?", "hunkers", "closing vn.", "sore", "open v adj.", "house sg", "houses pl", "lying vn.", "gable", "walls", "windows pl", "(i was) awake", "chairs pl", "numbness, pins and needles", "i shall sit 1 sg. fut.", "table", "(it is likely) that he will not come", "rest yourselves 2 pl.", "heather", "loft", "smoke", "a fetter between fore and hind feet", "wedge", "mistake, forgetting", "fire gen sg.", "spoon", "knife", "tongs", "sods pl.", "turf gen. sg.", "chimney", "yet", "a fragment of dry turf", "plough", "only for (him we would all have been drowned)", "grass", "load, burden", "footing", "for (water)", "timber", "ploughing vn", "to sharpen", "reaping-hook", "turned v. adj.", "turn around ipv. sg.", "garden", "potatoes pl.", "spade", "boiled v. adj.", "seed", "potato slits", "plentiful", "ripe", "wheat", "sheafs", "potato sprouts", "threshing vn.", "handle of a flail", "visiting at night", "barn", "singing vn.", "lent", "dance", "(they) will be married", "(he) will be buried", "coffin", "smith", "anvil", "melting vn.", "wake", "funeral", "when will you go (home)?", "(people) did not go", "scholars pl.", "rich", "a young girl", "hard", "everybody knows", "chapel", "it was said", "fortnight", "saying vn.", "devil", "palm sunday", "flea sg. or pl.", "ant sg. pl.", "moth sg. pl.", "maggots pl.", "mice", "butterfly", "hare", "curlew", "pigeon", "hawk", "snails pl.", "seagull", "crane", "thunder", "snipe", "it is raining", "shelter",
    "shower", "wind", "rainbow", "gone", "quickly", "fatter", "dew", "moon", "stars", "shining", "of the summer", "winter", "rising", "quarter of a year", "spring", "minutes", "(ten minutes) past", "april", "late", "waiting", "(i am middling)", "(i) know (him) well", "(he) made", "coming v.n.", "why did you not come?", "(he) comes", "(wait till he) comes!", "how are you?", "hill, mountain", "boundary", "there", "under me", "hurry (i am in a)", "wood", "trees pl.", "nettle", "he is afraid of me", "before them", "short cut", "(the shoes) do not fit (me)", "doing, making vn", "tired", "(he) makes", "book", "poteen", "(wait till) i am (at home)", "(he) was caught", "surprise", "to them", "lazy", "tide", "very busy", "limekiln", "change (on the moon)", "sword", "strand", "brink", "cliffs", "smell", "seaweed", "searods", "valley", "boats", "periwinkles", "oars", "fishing nets", "(the nets are) entangled", "counting vn", "dividing vn", "fishing-lines", "frame of fishing-line", "gills of a fish", "hook", "folding vn", "(he has) no patience", "bridge", "river", "(they) were killed", "(you) will be drowned", "mackerel", "herring", "salmon", "i did not notice him", "measuring vn", "trade", "dogfish", "the fur of a donkey", "rushes", "suspicion", "i met him (on the road)", "(maybe) we would not meet each other (again)", "forty", "shillings", "i heard what you said", "if you went", "show me (the house)", "nits", "he used to come", "we will wash ourselves", "he died suddenly", "whatever you will give me", "stubble", "moss"];
  const map_numbers = ["1", "2", "003a", "003b", "4", "5", "6", "007a", "007b", "8", "009a", "009b", "010a", "010b", "11", "12", "013a", "013b", "14", "15", "16", "17", "18", "19", "20", "021a", "021b", "22", "023a", "023b", "24", "25", "026a", "026b", "027a", "027b", "028a", "028b", "029a", "029b", "30", "31", "32", "33", "34", "35", "036a", "036b", "037a", "037b", "38", "39", "40", "41", "42", "43", "44", "045a", "045b", "045c", "46", "47", "48", "49", "50", "51", "052a", "052b", "053a", "053b", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "066a", "066b", "67", "68", "69", "70", "71", "72", "73", "74", "75", "076a", "076b", "77", "078a", "078b", "79", "80", "081a", "081b", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110a", "110b", "111", "112", "113", "114", "115", "116", "117a", "117b", "118", "119", "120a", "120b", "121", "122a", "122b", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132a", "132b", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147a", "147b", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160a", "160b", "161", "162", "163", "164", "165a", "165b", "166", "167a",
    "167b", "168", "169", "170", "171", "172", "173a", "173b", "174", "175", "176a", "176b", "177a", "177b", "178", "179", "180a", "180b", "181a", "181b", "182a", "182b", "183a", "183b", "184", "185", "186", "187a", "187b", "188", "189", "190", "191a", "191b", "192", "193a", "193b", "194a", "194b", "195", "196a", "196b", "197", "198", "199a", "199b", "200", "201", "202", "203", "204", "205", "206a", "206b", "207", "208", "209a", "209b", "210", "211", "212", "213", "214", "215a", "215b", "216", "217", "218", "219", "220", "221", "222", "223a", "223b", "224", "225", "226", "227", "228a", "228b", "229", "230", "231a", "231b", "232", "233a", "233b", "234", "235", "236", "237", "238", "239", "240", "241a", "241b", "242", "243a", "243b", "244", "245a", "245b", "246a", "246b", "247", "248a", "248b", "249", "250", "251", "252", "253", "254", "255", "256", "257a", "257b", "258a", "258b", "259a", "259b", "260", "261", "262", "263", "264", "265", "266a", "266b", "267", "268", "269a", "269b", "270a", "270b", "271", "272", "273a", "273b", "274a", "274b", "275a", "275b", "276", "277", "278", "279", "280a", "280b", "281", "282", "283", "284a", "284b", "285", "286a", "286b", "287", "288", "289a", "289b", "290", "291", "292a", "292b", "293", "294", "295a", "295b", "296", "297", "298", "299", "300a", "300b"];
  const dialect_statuses = ["yes", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "yes", "no", "no", "no", "yes", "no", "no", "yes", "no", "yes", "yes", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "yes", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "no", "no", "yes", "yes", "yes", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "yes", "yes", "yes", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "no", "yes", "yes", "no", "no", "yes", "yes", "no", "yes", "extra", "no", "no", "yes", "yes", "yes", "yes", "yes", "extra", "extra", "extra", "extra", "yes", "extra", "extra", "extra", "extra", "extra", "extra", "extra", "extra", "extra", "extra"];
  const simplified_view = ["yes", "no", "no", "yes", "no", "yes", "no", "no", "no", "no", "no", "yes", "no", "no", "no", "yes", "no", "no", "no", "no", "yes", "no", "yes", "yes", "no", "yes", "no", "no", "yes", "no", "no", "no", "no", "yes", "no", "no", "no", "no", "no", "no", "no", "no", "no", "no", "yes", "no", "no", "no", "no", "yes", "no", "no", "yes", "no", "no", "no", "no", "no", "yes", "no", "no", "no", "no", "no", "yes", "no", "yes", "yes", "yes", "yes", "yes", "no", "no", "no", "no", "no", "no", "no", "yes", "no", "no", "no", "no", "no", "no", "no", "no", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"];

  const dialect_colours = { "no": "#808000", "yes": "#008000", "extra": "#800000" };
  async function updateMap(number) {
    const initialData = await fetch("https://2-dot-spatial-tempo-386114.ew.r.appspot.com/maps/" + number);
    // const initialData = await fetch("http://localhost:5000/maps/" + number);
    const jsonResponse = await initialData.json();
    // console.log(jsonResponse);
    setCurrentMapData(jsonResponse);
    setCurrentMap(number);
  }

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value);
    setTextSize(newValue);
  };

  return (
    <div>


      <main>
        <div className={styles.containerDiv}>
          <div className={styles.sidebar}>
            <div style={{ "display": "flex", "minHeight": "15%" }}>
              <div>
                <h2>Map {map_numbers[currentMap]}: {english_words[currentMap]}</h2>
              </div>
              <div style={{ "paddingLeft": "150px" }}>
                <span style={{ "color": "#7fbf7f" }}>●</span> Living dialect
                <br />
                <span style={{ "color": "#bfbf7f" }}>●</span> Dead dialect (LASID)<br />
                <span style={{ "color": "#bf7f7f" }}>●</span> Dead dialect (other sources)
              </div>
            </div>

            <button className={styles.navButton} onClick={(e) => {
              setCurrentMap((Math.max(Number(currentMap) - 1, 0)).toString()); updateMap(Math.max(Number(currentMap) - 1, 0))
            }}>←</button>
            <button className={styles.navButton} onClick={(e) => {
              setCurrentMap((Math.min(Number(currentMap) + 1, 370)).toString()); updateMap(Math.min(Number(currentMap) + 1, 370))
            }}>→</button>
            <br />
            {/* <input
              type="text"
              value={currentMap} placeholder="Enter map number"
              onChange={(e) => { setCurrentMap(e.target.value) }} />
            <button onClick={(e) => updateMap(currentMap)}>Go to map</button> */}
            <br />
            <div style={{ "marginBottom": "20px" }}>
              Text size: {textSize}
              <input type="range" min="1" max="20" step="1" style={{ "margin": "0px 20px", "width": "30%" }} value={textSize} onChange={(e) => handleSliderChange(e)} />

              Simplified view:
              <input type="checkbox" style={{ "width": "20px", "height": "20px" }} onClick={(e) => { setSimplifiedView(e.target.checked); updateMap(currentMap) }}></input>
            </div>

            <div className={styles.scrollBox}>
              {english_words.map((word, i) => (<div className={(currentMap == i) ? styles.currentMap : styles.otherMap} onClick={() => { updateMap(i) }}>Map {map_numbers[i]}: {word}</div>))}
            </div>
          </div>
          <div>
            <svg className={styles.mainMap} height="800" width="700">
              {currentMapData.map((point, i) => (simplified_view[i] == "yes" || !simplifiedView) && <>
                {(point[0] != "") ? <circle cx={((10.65) - (0 - point[2])) * (200 * 0.59)} cy={(55.5 - point[1]) * 196} r={textSize * 0.25} fill={dialect_colours[dialect_statuses[i]]} /> : ""}
                <text className={`${(dialect_statuses[i] == "yes") ? styles.regularText : styles.deadDialectText} ${(point[0][0] == "$") ? styles.italicText : styles.regularText}`} key={i} x={((10.65) - (0 - point[2])) * (200 * 0.59)} y={(55.5 - point[1]) * 196} fill="black" style={{ "fontSize": textSize }}>{(point[0][0] == "$") ? point[0].slice(1) : point[0]}</text>

              </>

              )}
            </svg>
          </div>
        </div >

        {/* <table className={styles.wordTable}>

          {currentMapData.map((point, i) => <tr><td>{i}</td>
            <td>{point[0]}</td>
            <td>{point[1]}</td>
            <td>{point[2]}</td>
          </tr>)}

        </table> */}



      </main >

      <style jsx global>{`
        html,
        body {
          padding: 0px;
          margin: 0;
          height: 100%;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div >
  );
}
