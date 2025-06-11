    # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

real-time-chat app useing technology like that 
   -React js 
   -Firebase
   -ZegoCloud
   -Tailwind css
   -CSS3
         ## used icons React-icons weblink :- https://react-icons.github.io

 ##Add your new API KEY to the script inside src/firebase.js
        import { initializeApp } from "firebase/app";
            import {
              browserLocalPersistence,
              getAuth,
              setPersistence,
            } from "firebase/auth";
            import { getFirestore } from "firebase/firestore";
            
            const firebaseConfig = {
             apiKey: "YOUR_API_KEY",
             authDomain: "YOUR_AUTH_DOMAIN",
             projectId: "YOUR_PROJECT_ID",
             storageBucket: "YOUR_STORAGE_BUCKET",
             messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
             appId: "YOUR_APP_ID",
            };
            
            const app = initializeApp(firebaseConfig);
            
            export const auth = getAuth(app);
            export const db = getFirestore(app);
            
            setPersistence(auth, browserLocalPersistence)
             .then(() => {
            console.log("Firebase auth persistence set to localStorage.");
             })
             .catch((error) => {
                console.error("Error setting Firebase persistence:", error);
             });


         
