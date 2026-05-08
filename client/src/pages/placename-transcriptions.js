import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';
import { useState, useEffect } from 'react';



export default function Home() {
  const DEFAULT_CENTER = [53.5, -7.5];
  const [transcriptions,setTranscriptions] = useState([]);
  
  async function getTranscriptions(number) {
    const initialData = await fetch("http://localhost:5000/transcriptions/");
    // const initialData = await fetch("http://localhost:5000/maps/" + number);
    const jsonResponse = await initialData.json();
    console.log(jsonResponse);
    setTranscriptions(jsonResponse);
  }

  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
    getTranscriptions();
  }, []);


  return isBrowser ? (
    <Layout>
      <Head>
        <title>Dúchas maps</title>
        <meta name="description" content="Maps based on Dúchas.ie data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="left-div">
          Phonetic transcriptions of Irish placenames in their local dialect (as far as possible)
        </div>
        <div className="right-div">
          <Section>
            <Container>
              <Map className={styles.homeMap} width="750" height="500" center={DEFAULT_CENTER} zoom={7}>
                {({ TileLayer, Marker, Popup, GeoJSON }) => (
                  <>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    
                  </>
                )}
              </Map>
            </Container>
          </Section>
        </div>
      </div>
    </Layout>
  ) : null;
}
