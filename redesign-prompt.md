Kompletný prompt pre redizajn CuratedStack do
glassmorphism štýlu
Úloha:
Si senior UX/UI dizajnér špecializujúci sa na moderné webové aplikácie a glassmorphism
(frosted glass) štýl podobný najnovšiemu iOS („Liquid Glass” look – rozmazané,
polopriehľadné panely nad farebným/gradientovým pozadím).
Mojím projektom je CuratedStack – výber mojich obľúbených alebo zaujímavých apps,
ktorý zachytáva dennodene vyvíjajúci sa AI trend a technologické weby, ktoré ponúkajú
zaujímavé produkty, je to web pre nadšencov technológií.
Aktuálne má web UI v retro štýle Windows 95 (hranaté okná, sivé panely, pixel art feeling).
Chcem kompletný vizuálny redizajn celého webu do moderného glassmorphism štýlu, ale
pri zachovaní prehľadnosti, dobrej čitateľnosti a výkonu.
1. Kontext a ciele
Zohľadni prosím:
Typ projektu: webová appka na kurátorovanie linkov / tech nástrojov / resourceov.
Primárni používatelia: power-users, vývojári, produktoví ľudia, ktorí si ukladajú a
zdieľajú kvalitné zdroje.
Hlavné ciele UX:
rýchle nájdenie relevantných „stackov” / kolekcií,
ľahké filtrovanie a vyhľadávanie,
jasná hierarchia informácií,
responzívne správanie na desktop/tablet/mobil.
Tone & mood značky: moderný, tech, clean, dôveryhodný, trochu futuristický, ale nie
prázdny dribbble-dribbble.
Na základe tohto navrhni vizuálny jazyk a design systém v štýle glassmorphism.
2. Vizuálny smer – glassmorphism pre CuratedStack
Použi nasledujúce princípy glassmorphismu a prispôsob ich pre CuratedStack:
2.1 Pozadie
Použi jemné farebné gradienty alebo textúrované pozadie (napr. veľmi jemné šumové
textúry), aby malo „sklo” čo rozmazávať.
Žiadne príliš rušivé fotky alebo vysoký kontrast priamo pod hlavnými kartami.
2.2 Sklenené panely (cards, modály, navbar)
Polopriehľadné panely s background blur (frosted glass efekt) a transparentnosťou
(napr. biele/čierne sklo s opacity cca 10–30% – ty navrhni konkrétne rozsahy a štýly pre
svetlý/tmavý režim).
Jemná svetlá hranica (1 px border) s nízkou opacitou, aby panely pôsobili ako skutočné
sklo.
Mierne zaoblené rohy (border radius navrhni v pixeloch pre rôzne typy komponentov).
2.3 Hĺbka a vrstvy
Využi viac vrstiev (background → sekundárne karty → primárne panely), aby vznikol 3D
pocit hĺbky.
Dôležité prvky (napr. hlavné CTA, hlavný „stack” na stránke) nech sú vizuálne viac
„vystúpené” (silnejší blur, mierne väčší tieň, vyššia opacity panelu).
2.4 Tieňe a svetlo
Jemné, rozptýlené tiene pod hlavnými panelmi (bez tvrdých hrán).
Vyhni sa príliš silným glow efektom, ktoré by uberali na čitateľnosti.
2.5 Typografia a ikony
Použi moderný, čitateľný sans-serif font (navrhni 1–2 konkrétne rodiny, napr.
systémové vs. Google Fonts).
Definuj typografickú škálu (headingy, body text, meta info, kód, tagy).
Ikony jednoduché, lineárne alebo ploché, aby nekonkurovali glass efektu.
2.6 Farby
Navrhni primárnu, sekundárnu a akcentovú farbu (pre CTA, odkazy, stavy).
Paletu navrhni tak, aby na sklených paneloch držala sufficient contrast (WCAG min.
4.5:1, resp. 3:1 pre väčší text).
3. Stránky a informačná architektúra
Vytvor návrhy (aspoň wireframe + high-fidelity UI) pre tieto typy stránok:
3.1 Home / Landing stránka
Hero sekcia s krátkym vysvetlením CuratedStack + hlavné CTA.
Sekcia so zvýraznenými „Curated stacks” v sklenených kartách.
Krátky prehľad use-casov / výhod.
Footer (link na docs, pricing, about, kontakt).
3.2 Zoznam stackov / katalog
Mreža alebo zoznam kariet (glass cards) s názvom, krátkym popisom, tagmi,
ratingom/počet položiek.
Filter a vyhľadávanie v sklenom paneli (sticky/sidebar/filter bar).
„Empty state” (keď nie sú stacky alebo filter vráti 0 výsledkov).
3.3 Detail stacku
Názov stacku, opis, autor/kurátor, meta info.
Zoznam položiek (linky/nástroje/zdroje) v prehľadných sklenených boxoch.
Akcie: uložiť, zdieľať, forknúť/kopírovať, pridať do vlastnej kolekcie.
3.4 Moja knižnica / dashboard používateľa
Prehľad vlastných stackov a uložených stackov.
Rýchle akcie (edit, delete, share).
Priestor pre odporúčané stacky na základe preferencií.
3.5 Prihlasovanie/registrácia
Jednoduché glassmorphism panely uprostred obrazovky, s dôrazom na bezpečnosť a
dôveru.
Error states a form validation jasne vizuálne odlíšené.
Ak CuratedStack obsahuje ďalšie špecifické stránky (docs, pricing, blog), navrhni aj ich
vizuál v rovnakom štýle.
4. Komponenty & design systém
Vytvor konzistentný UI kit / komponentový systém:
4.1 Základné komponenty
Buttons (primary, secondary, tertiary, icon buttons) v glass štýle.
Inputy, selecty, textarea, search bar.
Tagy/chipy, badgy (napr. pre kategórie stackov).
Karty (basic card, featured card, compact list item).
Navbar (desktop & mobile), sidebar (ak vhodný).
Modály, toast notifikácie.
4.2 Stavy
Default, hover, active, focus, disabled.
Light & dark mode (ak odporúčaš – uveď aj ako by sa menili opacity, blur, farby).
4.3 Design tokens
Farby (primary/secondary/background/glass layer/color for light/dark).
Typografia (font-family, veľkosti, weighty, line-height).
Radius, tiene, blur hodnoty (napr. blur 8–16 px pre glass panely – ty navrhni konkrétne
rozsahy).
Spacing scale (4/8/12/16/24 atď. – navrhni systém).
5. Interakcie, animácie a microinteractions
Navrhni jemné, neagresívne animácie:
Hover efekty na kartách a tlačidlách (mierne zväčšenie, zmena opacity/tieňa).
Otváranie modálov (fade-in + mierny scale-up).
Prechody medzi stránky/sekcie (jemný slide/fade, žiadne brutálne parallax cirkusy).
Ak vhodné, ľahký parallax na pozadí vs. sklenené panely, aby sa posilnil pocit hĺbky.
6. Accessibility a performance
Zohľadni:
Kontrast textu na sklenených paneloch podľa WCAG.
Čitateľnosť na rôznych šírkach obrazovky (desktop, tablet, mobil).
Rozumné použitie blur efektov, aby:
nebol web ťažkopádny na slabších zariadeniach,
bolo možné použiť fallback (napr. menej blur / viac plné farby), ak prehliadač
nepodporuje backdrop-filter.
Navrhni aj:
Fallback štýl pre prípady, keď blur nie je dostupný (napr. jednofarebné semi-
transparent panely bez blur, ale so zachovanými bordermi a tieňmi).
7. Výstupy
Ako výstup chcem:
1. Popis design systému:
farby, typografia, komponenty, spacing, blur/opacity hodnoty,
guideline, ako aplikovať glassmorphism konzistentne naprieč novými podstránkami.
2. Návrhy obrazoviek:
aspoň 1 hlavný desktop layout pre každý typ stránky (Home, zoznam stackov, detail
stacku, dashboard, auth),
návrh, ako sa to rozpadne na tablet/mobil breakpointy.
3. Handoff pre vývoj:
odporúčané technológie (napr. CSS backdrop-filter, Tailwind/Chakra tokens,
atď.),
príklady CSS/Design tokenov, ktoré vývojár vie priamo použiť.
8. Extra (voliteľné)
Návrh light/dark módu (ak to zapadá k značke CuratedStack).
Ideové logo refresh / logomark, ktorý lepšie sedí k glassmorphism vizuálu (nie nutné, ale
nice-to-have).
Prípadné inšpiráčné referencie (štýlovo podobné weby/appky).