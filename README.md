# HOW TO GET APP

Testing through Expo Go
1) git clone https://github.com/Welene/react-native-app.git

2) cd react-native-app

3) skapa en .env fil i root mappen om den inte redan finns, klistra in det här:

PUBLIC_SUPABASE_URL=https://ihnxtbxrerswuxygjind.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_BqfwvGpgGDh7s4nnK8RGjw_xV1_qQg9

4) npm install

5) Ladda ner Expo Go på telefonen - öppna appen 

6) kör ”npx expo start” i terminalen – scanna QR kod med Expo Go appen (detta fungerar nog inte, jag har kört --tunnel i 3 veckor)

7) kör "npx expo start --tunnel" (viktigt att datorn och mobilen är på samma nätverk! (2.4GHz eller 5GHz)) 
      Då får du upp errors hela tiden (Cannot read properties of undefined body... remote gone away... took too long... etc)
   --> IGNORERA ERRORS & KÖR KOMMANDO IGEN (och igen och igen och igen och igen) helt tills den vill starta/fungera (när den fungerar ser du: "Tunnel connected. Tunnel ready.")
  
8) scanna QR koden i terminalen med mobilen (öppnar appen)

9) Testa iväg :)


* om den absolut inte vill starta med --tunnel, stäng ner terminalen, öppna upp en ny terminal och kör kommando tills det fungerar (kan ta ett tag, måste ha tur!)


.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.






How to download app -
This version in broken apparently. Follow the guide above:
1) GET AN ANDROID.

2) TURN ON LIGHT MODE ON YOUR PHONE (or just turn off dark mode)

3) GO TO THIS PAGE: 
https://expo.dev/accounts/welene/projects/my-millionth-native-app/builds/8859d293-1927-4178-abbd-063157f9df4b

4) CLICK INSTALL (by built artifact)

5) WAIT FOR THE BROWSER TO FINISH DOWNLOADING.

6) CLICK ON THE DOWNLOADED FILE

7) INSTALL IT - IF IT ASKS - CLICK "INSTALL"

8) WAIT FOR THE PHONE TO INSTALL IT

9) SCAN THE APP TO INSTALL (if it shows up)

10) WAIT FOR IT TO BE DONE SCANNING... (do not click anything yet)

11) CLICK "INSTALL" AFTER SCAN IS DONE

12) WAIT FOR IT TO FINISH INSTALLING (again)

13) CLICK "OPEN" WHEN DONE

14) PRAY TO GOD IT WORKS
