/** @format */
import Head from 'next/head';

export default function Error404() {
   return (
      <div style={{ textAlign: 'center' }}>
         <Head>
            <title>
               Bienvenue sur le portfolio de Benjamin Bourgouin
            </title>
         </Head>
         <h1
            style={{
               fontSize: '5rem',
               marginTop: '150px',
               textAlign: 'center',
               color: '#ee6c4d',
               marginBottom: '10px',
            }}
         >
            404
         </h1>
         <p style={{ fontSize: '1.5rem' }}>
            Cette page n'existe pas.
         </p>
      </div>
   );
}
