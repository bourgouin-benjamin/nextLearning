/** @format */

// Librairie
import CarteDeProjet from '../components/CarteDeProjet/CarteDeProjet';
import { connectToDatabase } from '../helpers/mongodb';
import Head from 'next/head';
import Image from 'next/image';
import { getSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import Error from '../components/ui/Error/Error';

export default function Index(props) {
   // State
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState();

   // Methodes
   const onDeleteClickedHandler = async () => {
      if (!isLoading) {
         setIsLoading(true);
         setError(null);

         // Envoyer ma demande de suppresion
         const response = await fetch('/api/supprimer', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
         });

         const fetchedData = await response.json();

         if (!response.ok) {
            setIsLoading(false);
            setError(
               fetchedData.message || 'Une erreur est survenue'
            );
         } else {
            setIsLoading(false);
            signOut();
         }
      }
   };

   return (
      <main>
         <Head>
            <title>
               Bienvenue sur le portfolio de Benjamin Bourgouin
            </title>
         </Head>
         <h1>
            Bienvenue{' '}
            {props.user
               ? props.user.name + '!'
               : 'sur mon projet NextJS !'}
         </h1>
         {error && <Error error={error} />}
         <div
            style={{
               border: '2px solid #ee6c4d',
               padding: '30px',
               borderRadius: '15px',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               gap: '30px',
            }}
         >
            <div>
               <h2 style={{ fontWeight: 'lighter' }}>
                  Je m'appelle <b>Benjamin</b>
               </h2>
               <p>
                  Je suis Analyste programmeur et designer numérique,
                  je maitrise de nombreuses technologies et possède
                  une regard avisé sur le design UI/UX d'une interface
                  numérique. Envie de collaborer avec moi ?
               </p>
               <p>
                  <a
                     href="mailto:benjamin.bourgouin.pro@gmail.com"
                     style={{
                        display: 'inline-block',
                        background: '#ee6c4d',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                     }}
                  >
                     Contactez-moi !
                  </a>

                  {props.user && (
                     <button
                        style={{
                           background: '#ee6c4d',
                           marginLeft: '10px',
                           color: 'white',
                           padding: '10px 15px 10px 15px',
                           borderRadius: '5px',
                           border: 'none',
                           cursor: 'pointer',
                        }}
                        onClick={onDeleteClickedHandler}
                     >
                        {' '}
                        {isLoading ? (
                           <SpinnerDotted
                              size={15}
                              thickness={100}
                              speed={100}
                              color="#ffffff"
                           />
                        ) : (
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              style={{
                                 width: '15px',
                                 height: '15px',
                              }}
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                           </svg>
                        )}
                     </button>
                  )}
               </p>
            </div>
            <div>
               <div
                  style={{
                     borderRadius: '50%',
                     overflow: 'hidden',
                     lineHeight: '0',
                  }}
               >
                  <Image
                     src="/photoDeProfil.jpg"
                     alt="Photo de moi"
                     width={150}
                     height={150}
                     layout="fixed"
                     quality={100}
                     //unoptimized --> Pour que NextJS ne s'occupe pas de l'optimisation de l'image
                     //priority={true} --> Pour que NextJS charge d'abord cette image avant le reste
                     //loading="eager"
                  />
               </div>
            </div>
         </div>

         <h2 style={{ marginTop: '45px' }}>Mes derniers projets</h2>
         <div
            style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(3, 1fr)',
               gap: '10px',
            }}
         >
            {props.projetsRecents.map((projet, index) => (
               <CarteDeProjet projet={projet} key={index} />
            ))}
         </div>
      </main>
   );
}

export async function getServerSideProps(context) {
   let projetsRecents;
   const session = await getSession({ req: context.req });
   let user = null;

   if (session) {
      user = session.user;
   }

   try {
      const client = await connectToDatabase();
      const db = client.db();

      projetsRecents = await db
         .collection('projets')
         .find()
         .sort({ dateDePublication: 'desc' })
         .limit(3)
         .toArray();
   } catch (error) {
      projetsRecents = [];
   }

   return {
      props: {
         projetsRecents: JSON.parse(JSON.stringify(projetsRecents)),
         user,
      },
   };
}
