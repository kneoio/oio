<template>
  <div class="home" :class="{ 'station-expanded': !!expandedStation }">
    <header class="header" v-show="!expandedStation">
      <div ref="title" class="logo-wrap">
        <span class="header-text">m i x</span>
        <svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="164 181 667 680">
          <path d="M 164.169 181.283 C 384.013 181.283 603.859 181.283 830.363 181.283 C 830.363 405.463 830.363 629.645 830.363 860.619 C 610.521 860.619 390.675 860.619 164.169 860.619 C 164.169 636.438 164.169 412.257 164.169 181.283 Z" fill="transparent"/>
          <path class="logo-path" d="M0 0 C-0.65226563 0.76183594 -1.30453125 1.52367187 -1.9765625 2.30859375 C-2.85962095 3.35135426 -3.74241928 4.39433511 -4.625 5.4375 C-5.05167969 5.93443359 -5.47835937 6.43136719 -5.91796875 6.94335938 C-6.34980469 7.45576172 -6.78164063 7.96816406 -7.2265625 8.49609375 C-7.68659668 9.04185059 -8.14663086 9.58760742 -8.62060547 10.14990234 C-10.07487607 12.00169526 -10.07487607 12.00169526 -11.19580078 14.26025391 C-14.05497788 19.51598262 -16.50080519 21.62807925 -22.2265625 23.53125 C-24.68497184 24.21591258 -27.15179868 24.87086205 -29.625 25.5 C-32.25722201 26.23241513 -34.88075678 26.99361873 -37.50390625 27.7578125 C-38.47640572 28.03741318 -38.47640572 28.03741318 -39.46855164 28.32266235 C-61.57394988 34.77443434 -82.53532992 47.47361994 -101 61 C-101.87011719 61.63679688 -102.74023438 62.27359375 -103.63671875 62.9296875 C-108.52812405 66.63452153 -113.07711593 70.68260997 -117.6015625 74.82421875 C-119.67632221 76.70637047 -121.79182174 78.51275762 -123.9375 80.3125 C-165.71028095 116.98900167 -188.61897502 173.90414642 -195 228 C-194.34 227.67 -193.68 227.34 -193 227 C-190.52994663 226.90166064 -188.09442339 226.86096919 -185.625 226.875 C-184.61566406 226.86919922 -184.61566406 226.86919922 -183.5859375 226.86328125 C-180.24719055 226.86985359 -177.19146915 226.96890997 -174 228 C-173.92523438 227.13503906 -173.85046875 226.27007812 -173.7734375 225.37890625 C-168.09166884 170.95647503 -140.096157 118.83990431 -97.515625 84.2734375 C-79.15692924 69.84831304 -56.80500785 55.02724477 -34 49 C-35.54867945 54.07132337 -37.65384808 58.73156719 -39.9375 63.5 C-40.28490234 64.23347656 -40.63230469 64.96695313 -40.99023438 65.72265625 C-41.67284489 67.15986633 -42.3631717 68.59344101 -43.06176758 70.02294922 C-43.88064977 71.74850426 -44.60877832 73.51654244 -45.3203125 75.2890625 C-47.52170663 78.84201023 -50.27105929 80.1636577 -53.9375 81.875 C-55.29672084 82.55502066 -56.6534691 83.24000399 -58.0078125 83.9296875 C-58.68231445 84.27225586 -59.35681641 84.61482422 -60.05175781 84.96777344 C-72.64757314 91.64134577 -83.65886659 101.30424937 -94 111 C-94.74854248 111.69754395 -94.74854248 111.69754395 -95.51220703 112.40917969 C-132.79226061 147.42740064 -152.42472666 198.44356858 -154.10058594 249.03662109 C-155.2030284 293.54943673 -145.57397659 334.88392665 -129 376 C-128.55889893 377.10843262 -128.55889893 377.10843262 -128.10888672 378.23925781 C-124.70479785 386.75920594 -120.56894944 394.79360935 -116.2109375 402.8515625 C-114.25809835 406.47588545 -112.46272334 410.16002043 -110.6875 413.875 C-106.16298612 423.00820476 -100.55413706 431.46828755 -95 440 C-94.26670199 441.1404803 -93.5336023 442.28108816 -92.80078125 443.421875 C-83.47915872 457.71629007 -72.60006534 471.07020036 -61.11328125 483.66796875 C-59.22623463 485.75034736 -57.38941767 487.86503064 -55.5625 490 C-48.95569358 497.57029902 -41.72928315 504.58443989 -34 511 C-33.4834082 511.43038574 -32.96681641 511.86077148 -32.43457031 512.30419922 C-10.12523874 530.79927393 15.60075938 549.28072412 46 547 C54.04570559 545.363729 61.68021693 542.6950828 69 539 C70.0725 538.48050781 71.145 537.96101562 72.25 537.42578125 C87.99182485 529.58150654 101.92533588 518.68062937 115 507 C115.56090332 506.50081055 116.12180664 506.00162109 116.69970703 505.48730469 C122.50795997 500.29293214 128.21705443 495.084523 133.21875 489.08984375 C135.43197645 486.49318552 137.78243775 484.04305801 140.125 481.5625 C146.99790084 474.16275242 153.00097025 466.11179858 159 458 C159.44730469 457.39929688 159.89460938 456.79859375 160.35546875 456.1796875 C171.89042563 440.63411484 181.93420731 424.09099005 191 407 C191.34482422 406.3503125 191.68964844 405.700625 192.04492188 405.03125 C205.97334805 378.53194406 218.11719121 349.35772055 224.0625 319.9375 C224.22532471 319.1444043 224.38814941 318.35130859 224.5559082 317.53417969 C225.73838832 311.62814586 226.76494932 305.70192125 227.6875 299.75 C227.86647827 298.61872681 227.86647827 298.61872681 228.04907227 297.46459961 C229.92708269 284.71232495 230.1866307 271.85944596 230.18530273 258.99414062 C230.18749172 256.63393149 230.20574991 254.27418991 230.22460938 251.9140625 C230.27519504 238.34943597 229.17334886 224.96255807 226.25 211.6875 C225.99621582 210.52166382 225.99621582 210.52166382 225.73730469 209.33227539 C222.17000071 193.49008754 217.12575898 178.59323786 210 164 C209.45730469 162.88496094 208.91460938 161.76992188 208.35546875 160.62109375 C199.85282228 144.09161801 188.7438591 129.22402772 176.21484375 115.55859375 C175 114 175 114 175 112 C177.90946313 110.79428057 180.82849916 109.61371775 183.75 108.4375 C184.575 108.09525391 185.4 107.75300781 186.25 107.40039062 C187.04921875 107.08134766 187.8484375 106.76230469 188.671875 106.43359375 C189.4050293 106.13509521 190.13818359 105.83659668 190.89355469 105.52905273 C193.34814067 104.91256133 194.6455157 105.12477448 197 106 C224.42088581 128.71688448 244.86368004 178.48312309 249 213 C249.49148714 218.32678442 249.79388572 223.65524356 250 229 C251.22589844 228.50886719 251.22589844 228.50886719 252.4765625 228.0078125 C256.59263124 226.83048907 260.13044334 226.77521838 264.375 226.875 C265.11105469 226.88402344 265.84710937 226.89304687 266.60546875 226.90234375 C268.4037888 226.92569856 270.20193911 226.96156164 272 227 C270.71694585 219.98979355 269.37383989 212.99294815 268 206 C267.82871582 205.10812988 267.65743164 204.21625977 267.48095703 203.29736328 C260.35280106 166.75272503 244.45629115 132.38198973 221.546875 103.0546875 C220 101 220 101 220 100 C221.74909249 99.71443388 223.50502687 99.45848863 225.26953125 99.29296875 C228.13464924 99.02835568 228.13464924 99.02835568 231.44921875 98.30078125 C235.8228718 97.73890393 238.7592475 97.72559951 243 99 C248.49148342 103.68690597 251.64095087 110.74548593 255 117 C256.07467259 118.90429622 257.15285378 120.80661627 258.234375 122.70703125 C263.24983932 131.63128596 267.87291092 140.62927469 272 150 C272.76957031 151.73830078 272.76957031 151.73830078 273.5546875 153.51171875 C285.24409217 181.62854122 291.91252735 213.11448405 292.7265625 243.546875 C293.12595271 248.59060286 293.46276033 252.5973335 297.3203125 256.1171875 C298.24585938 256.69726562 299.17140625 257.27734375 300.125 257.875 C314.03045171 267.38160293 320.82096331 281.6234469 324.0546875 297.90234375 C329.22566669 327.23057669 323.31969718 357.22045979 307 382 C299.40950809 392.1857704 289.24226594 399.41597762 277 403 C275.14811372 403.24691817 273.29374211 403.47580062 271.4375 403.6875 C265.55307789 404.58961253 263.06383577 407.49246264 259.1953125 411.8046875 C253.58114727 417.41885273 245.9844194 418.94319953 238.3125 419.3125 C228.85979451 419.18627693 221.45186301 414.39990073 214 409 C213.76796875 409.804375 213.5359375 410.60875 213.296875 411.4375 C211.67899045 415.88180936 209.54039794 419.87020754 207.25 424 C206.77046875 424.8664917 206.2909375 425.7329834 205.796875 426.62573242 C197.27550782 441.81664544 187.84098435 456.47825876 177.27490234 470.328125 C176.01336737 471.98247037 174.7655916 473.6464803 173.51953125 475.3125 C165.37210286 486.13529995 156.73249785 496.54634618 147.0078125 505.9921875 C145.07981582 507.92018418 143.31932966 509.91631831 141.5625 512 C137.4384498 516.78616835 132.77650318 520.87828441 128 525 C126.67548828 526.15628906 126.67548828 526.15628906 125.32421875 527.3359375 C106.30605228 543.59212959 85.10630249 558.56461449 61 566 C59.42992187 566.50466797 59.42992187 566.50466797 57.828125 567.01953125 C44.46652847 570.73296988 29.10129739 570.52905777 16 566 C14.83082031 565.63261719 13.66164063 565.26523437 12.45703125 564.88671875 C-13.67210474 556.23923486 -35.97476065 538.31649887 -56 520 C-57.01497377 519.08911758 -58.03062626 518.178991 -59.046875 517.26953125 C-64.03478867 512.78537667 -68.8603901 508.28802102 -73.17578125 503.13671875 C-75.0054736 500.99358874 -76.91284294 498.93694189 -78.84082031 496.88232422 C-84.77824694 490.5313762 -90.2390938 483.90168627 -95.49609375 476.97949219 C-96.53307059 475.61458826 -97.5750494 474.25347502 -98.62109375 472.89550781 C-111.28438268 456.42299629 -121.87949653 438.88279092 -131.875 420.6875 C-132.39336426 419.74414795 -132.91172852 418.8007959 -133.44580078 417.82885742 C-133.9148584 416.96107666 -134.38391602 416.0932959 -134.8671875 415.19921875 C-135.48762939 414.05199341 -135.48762939 414.05199341 -136.12060547 412.8815918 C-137 411 -137 411 -137 409 C-137.9178125 409.55429687 -138.835625 410.10859375 -139.78125 410.6796875 C-149.21732288 416.28935177 -157.78283284 420.95864802 -169.1875 418.53515625 C-175.8169253 416.59006445 -182.22734226 413.15182461 -186.828125 407.921875 C-189.71150538 405.37039452 -192.18860027 404.98605891 -195.9375 404.1875 C-211.08062555 400.556476 -223.72702447 392.01222664 -232.28125 378.8984375 C-239.50334857 366.71935309 -244.02499946 354.85363888 -247 341 C-247.36931641 339.35644531 -247.36931641 339.35644531 -247.74609375 337.6796875 C-252.08832504 314.74072772 -249.20187033 290.99176494 -237 271 C-232.56647502 264.7602241 -226.48543951 258.67799808 -219.88671875 254.73828125 C-216.42341296 251.54745086 -216.08802198 246.94290021 -215.66503906 242.41186523 C-215.61573242 241.16091064 -215.56642578 239.90995605 -215.515625 238.62109375 C-215.08921488 230.01987327 -214.02061005 221.57556339 -212.75 213.0625 C-212.64051025 212.31920441 -212.53102051 211.57590881 -212.41821289 210.81008911 C-210.78805641 199.8531718 -208.57472925 189.5000668 -205 179 C-204.37382518 176.85835154 -203.77511755 174.71004625 -203.17651367 172.56054688 C-199.06674948 157.93207409 -193.06653004 144.41769833 -186 131 C-185.62359375 130.2790918 -185.2471875 129.55818359 -184.859375 128.81542969 C-175.16976139 110.3809398 -163.20535686 93.75113105 -149.15625 78.37890625 C-147.20384564 76.22489491 -145.31722641 74.02972274 -143.4375 71.8125 C-140.56099111 68.51375127 -137.47595247 65.65216266 -134.13671875 62.828125 C-131.86344379 60.8831658 -129.68924351 58.85139345 -127.5 56.8125 C-96.17490443 28.68676632 -55.83630416 9.74055445 -14.875 1 C-13.84914795 0.77989258 -12.8232959 0.55978516 -11.76635742 0.33300781 C-10.80963135 0.14061523 -9.85290527 -0.05177734 -8.8671875 -0.25 C-8.02269043 -0.42015625 -7.17819336 -0.5903125 -6.30810547 -0.765625 C-3.91675068 -1.0084535 -2.27256502 -0.73287441 0 0 Z" fill="currentColor" transform="translate(450,266)"/>
          <path class="logo-path" d="M0 0 C6.48548979 4.53389286 10.17328913 9.83217611 11.69140625 17.67578125 C13.29727216 36.83347977 5.21429433 53.8536047 -6.30859375 68.67578125 C-6.97375 69.55492187 -7.63890625 70.4340625 -8.32421875 71.33984375 C-24.33103747 91.78020578 -50.00516929 110.80311963 -76.30859375 114.67578125 C-97.07456805 116.27899021 -97.07456805 116.27899021 -105.30859375 109.67578125 C-111.62207743 104.01416778 -114.88990532 98.50639898 -115.62109375 90.0703125 C-116.50708498 69.94530386 -106.90480469 51.83025878 -94.30859375 36.67578125 C-93.61121094 35.82628906 -92.91382813 34.97679687 -92.1953125 34.1015625 C-72.5624053 11.23837806 -30.70935618 -17.61501141 0 0 Z" fill="currentColor" transform="translate(632.30859375,527.32421875)"/>
          <path class="logo-path" d="M0 0 C11.00258479 5.55391345 20.61381071 12.71867334 29.4375 21.3046875 C30.24445313 22.04976562 31.05140625 22.79484375 31.8828125 23.5625 C47.11139775 38.02726906 60.9203475 58.24436138 61.95849609 79.76342773 C62.13553569 89.2704538 60.13136859 95.83316237 54.0625 103.1796875 C44.095704 111.24804617 33.77359195 111.24248988 21.4375 110.3046875 C-6.24460201 106.09191106 -33.48361161 84.14358006 -49.7578125 62.16015625 C-52.21391883 58.6417126 -54.42300694 55.02364272 -56.5625 51.3046875 C-57.07941406 50.41523437 -57.59632813 49.52578125 -58.12890625 48.609375 C-64.68775539 36.43145212 -68.65073002 21.83095239 -64.64453125 8.17578125 C-60.83450525 -0.09777036 -54.73673484 -4.13978178 -46.5625 -7.6953125 C-31.60210604 -12.68211049 -13.53993333 -6.49282502 0 0 Z" fill="currentColor" transform="translate(398.5625,531.6953125)"/>
          <path class="logo-path logo-path-white" d="M0 0 C3.37622501 3.84191122 3.50941037 7.63979258 3.35546875 12.55859375 C2.82863459 16.17696026 1.42077514 18.31024985 -1 21 C-4.82504374 23.74997816 -9.09842557 23.18277448 -13.59375 23.0546875 C-15.3508931 23.02579752 -17.10805602 22.99809477 -18.86523438 22.97143555 C-19.78522217 22.95478851 -20.70520996 22.93814148 -21.65307617 22.92098999 C-46.12402478 22.52567956 -69.61122037 24.2750739 -93 32 C-93.79809082 32.25652344 -94.59618164 32.51304687 -95.41845703 32.77734375 C-128.53250952 43.49278709 -156.46483011 61.38438693 -181 86 C-181.61101562 86.57621094 -182.22203125 87.15242188 -182.8515625 87.74609375 C-209.47079273 113.134038 -225.59640004 148.71494627 -236.015625 183.37890625 C-237.8514258 189.31611915 -239.44620238 193.67973047 -244 198 C-249.40115361 199.80038454 -254.2171082 199.85842938 -259.375 197.375 C-263.36111422 193.76851571 -264.84756572 190.88849139 -265.28125 185.515625 C-265.18742899 179.8889347 -263.38584243 174.79783177 -261.625 169.5 C-261.26849365 168.41138672 -260.9119873 167.32277344 -260.54467773 166.20117188 C-250.94773927 137.53633309 -237.67530931 110.82475121 -219 87 C-218.401875 86.20851563 -217.80375 85.41703125 -217.1875 84.6015625 C-197.08794023 58.52411642 -171.07511058 37.31868821 -142 22 C-141.2663623 21.61344238 -140.53272461 21.22688477 -139.77685547 20.82861328 C-108.85450675 4.79833544 -33.06284443 -23.12655902 0 0 Z" fill="currentColor" transform="translate(714,262)"/>
          <path class="logo-path logo-path-white" d="M0 0 C4.09339426 3.60608542 5.47660268 5.75432816 6 11.25 C5.820349 15.22477842 4.89674776 17.98060329 2.625 21.3125 C-1.71074353 24.65758403 -5.88861135 26.24164768 -11.125 27.5625 C-19.89996398 29.96858495 -27.99534394 33.3851009 -36.20361328 37.28173828 C-37.60981614 37.94926566 -39.019473 38.60958447 -40.43310547 39.26123047 C-56.13074484 46.49892653 -70.28342622 56.04135216 -83.375 67.3125 C-84.44105305 68.19731065 -85.50885044 69.08002269 -86.578125 69.9609375 C-97.68793599 79.14967363 -107.31080482 88.9792343 -115.99267578 100.49023438 C-117.32996494 102.25313198 -118.69168402 103.99439929 -120.05859375 105.734375 C-142.33711426 134.53679839 -155.06587894 168.74692375 -161.375 204.3125 C-161.59027344 205.47136719 -161.80554688 206.63023437 -162.02734375 207.82421875 C-163.24168988 214.88869952 -163.71588978 221.88849116 -163.8581543 229.04736328 C-164.06124238 234.96649359 -165.48426092 239.06724734 -169.375 243.6875 C-173.97163269 246.17734271 -178.26350875 246.0405685 -183.375 245.3125 C-188.09668504 243.20460489 -189.8778661 241.00245742 -191.79980469 236.24633789 C-192.75595873 233.03169604 -192.50912137 230.13456879 -192.25 226.8125 C-192.19360352 226.08893311 -192.13720703 225.36536621 -192.07910156 224.61987305 C-191.873318 222.18041637 -191.62972549 219.74732117 -191.375 217.3125 C-191.28444336 216.42900879 -191.19388672 215.54551758 -191.10058594 214.63525391 C-185.06950136 158.13613324 -160.8407581 105.30252297 -121.375 64.3125 C-120.82408691 63.73967285 -120.27317383 63.1668457 -119.70556641 62.57666016 C-94.07288698 36.0850247 -62.08276046 15.73255082 -27.375 3.3125 C-25.993469 2.79953461 -24.6119581 2.28651507 -23.23046875 1.7734375 C-7.71175925 -3.85587963 -7.71175925 -3.85587963 0 0 Z" fill="currentColor" transform="translate(591.375,200.6875)"/>
          <path class="logo-path logo-path-white" d="M0 0 C0.99507568 0.14477783 0.99507568 0.14477783 2.01025391 0.29248047 C44.11764744 6.72423433 44.11764744 6.72423433 53.1875 17.1875 C56.1973839 21.8580095 56.98352677 25.46878984 56 31 C53.96994709 34.3792573 51.55205232 37.22397384 48 39 C39.45881349 39.96815421 32.85329205 37.85845583 25 34.75 C-15.76523471 19.75989609 -59.87545481 23.82230061 -98.984375 41.58203125 C-116.84170046 50.01389578 -131.76029237 61.44508736 -146 75 C-147.13501953 76.03833984 -147.13501953 76.03833984 -148.29296875 77.09765625 C-161.40069905 89.48911714 -171.39778616 105.06310879 -179.59765625 121.01953125 C-180.26051636 122.30561279 -180.26051636 122.30561279 -180.93676758 123.61767578 C-181.79168699 125.29064133 -182.63464571 126.96979092 -183.46362305 128.65576172 C-185.70570183 133.08411147 -187.58344478 136.41121917 -192 139 C-196.5581332 140.03532819 -201.11459691 140.08114023 -205.234375 137.71875 C-208.17768751 135.23761053 -210.55566025 133.09343575 -211.37890625 129.21484375 C-212.5549561 114.62682113 -200.75431444 99.57030834 -193 88 C-192.60055176 87.4009082 -192.20110352 86.80181641 -191.78955078 86.18457031 C-162.47084084 42.63289384 -117.38529241 12.04632239 -66.0625 1.1875 C-63.71208063 0.7699913 -61.3577866 0.37366707 -59 0 C-57.80375 -0.20367187 -56.6075 -0.40734375 -55.375 -0.6171875 C-37.07475854 -3.35472362 -18.27004545 -2.66481603 0 0 Z" fill="currentColor" transform="translate(715,325)"/>
          <path class="logo-stripe" d="M0 0 C3.6578218 2.03993908 5.66946174 3.50419262 8 7 C8.265625 9.6796875 8.265625 9.6796875 8.25 12.875 C8.25773438 14.41800781 8.25773438 14.41800781 8.265625 15.9921875 C7.84888533 25.90341964 5.54133433 35.85929894 3.828125 45.61328125 C3.62517319 46.77401657 3.42222137 47.93475189 3.21311951 49.13066101 C2.56054226 52.85825827 1.90556777 56.58542759 1.25 60.3125 C1.02623688 61.58633545 0.80247375 62.8601709 0.57192993 64.17260742 C-2.62184343 82.34206108 -5.84499105 100.50309926 -9.34863281 118.61572266 C-10.03323215 122.17266271 -10.70031457 125.73266639 -11.3671875 129.29296875 C-11.80647199 131.59130265 -12.24653637 133.88948767 -12.6875 136.1875 C-12.87803955 137.21681641 -13.0685791 138.24613281 -13.26489258 139.30664062 C-14.40603378 145.14434245 -15.42640255 149.80487276 -20.125 153.8125 C-24.16699226 155.48201854 -27.69319009 155.81890048 -32 155 C-35.86817551 152.93478765 -38.32865301 150.03003426 -40 146 C-41.25001847 138.73034454 -38.69911287 132.75877772 -35.875 126.1875 C-31.5438704 115.61105137 -27.96425106 105.03408625 -25 94 C-24.77860352 93.18418457 -24.55720703 92.36836914 -24.32910156 91.52783203 C-18.66989934 70.31621135 -15.1954361 48.22152302 -14.859375 26.25390625 C-14.84003906 25.14982422 -14.82070313 24.04574219 -14.80078125 22.90820312 C-14.76651489 20.65057707 -14.74866684 18.39265025 -14.74609375 16.13476562 C-14.54017118 6.92785936 -14.54017118 6.92785936 -11.640625 3.27734375 C-7.84447674 0.00344666 -4.91177303 -0.48154638 0 0 Z" fill="currentColor" transform="translate(716,511)"/>
          <path class="logo-stripe" d="M0 0 C3.01784991 1.75607646 5.41468217 3.82936435 7 7 C7.13139315 8.99214928 7.2029234 10.98836417 7.24609375 12.984375 C7.27727295 14.21800781 7.30845215 15.45164062 7.34057617 16.72265625 C7.355914 17.3789502 7.37125183 18.03524414 7.38705444 18.71142578 C8.14373735 49.29002134 11.70991724 79.01460182 22 108 C22.51245821 109.47891064 23.02417216 110.95807938 23.53515625 112.4375 C25.45944297 117.96783389 27.42235885 123.48181128 29.48828125 128.9609375 C30.17470703 130.80558594 30.17470703 130.80558594 30.875 132.6875 C31.28492188 133.76386719 31.69484375 134.84023438 32.1171875 135.94921875 C33.47655102 140.64684223 33.64542943 143.75878956 31.375 148.125 C27.67756428 152.60084324 24.85632952 154.70534452 19.0625 155.625 C15.01429718 155.3458136 12.39043486 154.02598994 9.46875 151.23046875 C6.30515452 146.42617881 5.90468595 140.57403277 5 135 C4.67641483 133.52416445 4.34395797 132.05025365 4.00390625 130.578125 C3.02487022 126.26024323 2.35562099 121.94592992 1.75 117.5625 C-1.12512771 97.66623035 -4.88777332 77.88637448 -8.5625 58.125 C-8.76109619 57.05451416 -8.95969238 55.98402832 -9.16430664 54.88110352 C-10.00649134 50.34260676 -10.84892355 45.80419805 -11.70117188 41.26757812 C-12.41258877 37.47142675 -13.11339086 33.67343491 -13.8125 29.875 C-14.03172119 28.71887207 -14.25094238 27.56274414 -14.47680664 26.37158203 C-17.26859883 11.07134454 -17.26859883 11.07134454 -14.8125 5.125 C-10.77837157 0.39533218 -6.17930404 -1.32758485 0 0 Z" fill="currentColor" transform="translate(268,511)"/>
          <path class="logo-stripe" d="M0 0 C3.94196948 5.91295422 4.09834199 13.41820221 4.70736694 20.36547852 C4.98142558 22.83277789 5.39582043 25.19663898 5.90478516 27.625 C7.02139538 33.07018714 8.03253188 38.53069228 9.0234375 44 C9.20984299 45.02682892 9.39624847 46.05365784 9.58830261 47.11160278 C10.18552442 50.40743828 10.78061156 53.7036524 11.375 57 C11.57664764 58.11695251 11.77829529 59.23390503 11.98605347 60.38470459 C14.9007865 76.55723168 17.68712694 92.72901887 20 109 C11.72533363 107.65429301 5.18789567 102.43205164 0 96 C-7.65009044 84.57328263 -11.42813988 73.41626394 -14 60 C-14.26018921 58.82691284 -14.26018921 58.82691284 -14.52563477 57.63012695 C-17.6668176 40.21377972 -15.398124 21.07756584 -6 6 C-4.11532387 3.72214881 -2.25347614 1.93155098 0 0 Z" fill="currentColor" transform="translate(235,541)"/>
          <path class="logo-stripe" d="M0 0 C6.00775537 2.49891549 8.77013741 8.12126802 11.23828125 13.8984375 C14.36416444 22.37810608 15.21391576 29.28552826 15.24023438 38.35009766 C15.24980122 40.33378205 15.28092259 42.31732514 15.3125 44.30078125 C15.38257652 61.83742994 11.13671541 79.47419132 1 94 C0.56171875 94.63421875 0.1234375 95.2684375 -0.328125 95.921875 C-4.45175048 101.27784833 -10.03318768 104.91823979 -16 108 C-16.99 108 -17.98 108 -19 108 C-18.39245302 100.63742317 -17.27942423 93.44887956 -15.9375 86.1875 C-15.48916001 83.71882684 -15.04127743 81.25007059 -14.59375 78.78125 C-14.47152573 78.10982468 -14.34930145 77.43839935 -14.22337341 76.74662781 C-12.6114394 67.88705352 -11.03954181 59.02033477 -9.46466064 50.15411377 C-8.939857 47.20076407 -8.41410403 44.24758461 -7.88818359 41.29443359 C-6.45178422 33.22276287 -5.01835896 25.15088777 -3.6328125 17.0703125 C-3.445979 15.98081299 -3.25914551 14.89131348 -3.06665039 13.76879883 C-2.74251684 11.86810479 -2.42115909 9.96693418 -2.10327148 8.06518555 C-1.10808267 2.21616534 -1.10808267 2.21616534 0 0 Z" fill="currentColor" transform="translate(741,542)"/>
        </svg>
        <span class="header-text">p l a</span>
      </div>
    </header>

    <main class="main">

      <!-- DETAIL PANEL -->
      <div
        v-if="expandedStation"
        ref="detailEl"
        class="station-detail"
        :style="{ '--card-color': expandedStation._color || expandedStation.color || '#FF4757' }"
      >
          <button class="detail-close" @click="closeStation" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div class="detail-header">
            <div class="detail-glow"></div>
            <div class="detail-play-wrap">
              <button
                class="play-btn detail-play-btn"
                :class="{ playing: currentStation?.id === expandedStation.id && isPlaying }"
                @click="quickPlayDetail"
              >
                <svg v-if="currentStation?.id === expandedStation.id && isPlaying" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div class="detail-title-block">
              <div class="detail-status-pill" :class="expandedStation.isOnline ? 'online' : expandedStation.isIdle ? 'idle' : 'offline'">
                <span class="status-dot-sm"></span>
                {{ expandedStation.isOnline ? 'Live' : expandedStation.isIdle ? 'Idle' : 'Offline' }}
              </div>
              <h1 class="detail-name" :style="expandedStation.titleFont ? { fontFamily: expandedStation.titleFont } : {}">{{ expandedStation.name }}</h1>
              <p class="detail-country">{{ expandedStation.djName || expandedStation.currentSong?.artist }}</p>
            </div>
          </div>

          <div class="detail-body">
            <div class="detail-section">
              <span class="section-label">Now playing</span>
              <p class="detail-track">
                <span v-if="currentStation?.id === expandedStation.id && isPlaying">
                  {{ currentSongTitle }} — {{ currentSongArtist }}
                </span>
                <span v-else>{{ expandedStation.currentSong?.title }}</span>
              </p>
            </div>

            <div class="detail-section">
              <span class="section-label">Tags</span>
              <div class="tags detail-tags">
                <span
                  v-for="tag in expandedStation.currentSong?.tags"
                  :key="tag"
                  class="tag"
                  :data-tag="tag"
                >{{ tag }}</span>
              </div>
            </div>

            <div class="detail-section detail-chat">
              <div class="chat-dj-header">
                <span class="chat-dj-status offline">
                  <span class="chat-status-dot"></span>DJ offline
                </span>
              </div>

              <div class="chat-messages" ref="chatMessages">
                <div class="chat-empty">
                  <p>No messages yet. Say hi!</p>
                </div>
              </div>

              <div class="chat-input-row">
                <label class="chat-attach-btn" title="Attach file">
                  <input type="file" style="display:none" @change="attachFile" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </label>
                <input
                  class="chat-input"
                  type="text"
                  placeholder="Message the DJ..."
                  v-model="chatMessage"
                  @keydown.enter="sendMessage"
                />
                <button class="chat-send-btn" @click="sendMessage">Yo</button>
              </div>
            </div>
          </div>
        </div>
      <!-- GRID — hidden while detail is open -->
      <template v-if="!expandedStation">
        <div v-if="loading" class="loading-grid">
          <div v-for="n in 6" :key="n" class="skeleton-card"></div>
        </div>

        <div v-else-if="error" class="error">
          <p>Failed to load stations. Please try again.</p>
          <button @click="fetchStations" class="retry-btn">Retry</button>
        </div>

        <div v-else class="station-grid" ref="stationGrid">
          <div
            v-for="station in stations"
            :key="station.id"
            class="station-card"
            :class="{ offline: !station.isOnline && !station.isIdle }"
            :style="{ '--color': station.color }"
            @click="goToStation(station, $event)"
            ref="stationCards"
          >
            <div class="station-image">
              <div class="mood-gradient"></div>
              <div class="play-overlay">
                <button
                  class="play-btn"
                  :class="{ playing: currentStation?.id === station.id && isPlaying }"
                  @click.stop="quickPlay(station, $event)"
                >
                  <svg v-if="currentStation?.id === station.id && isPlaying" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="station-info">
              <h3 :style="station.titleFont ? { fontFamily: station.titleFont } : {}">{{ station.name }}</h3>
              <p class="current-song" v-if="currentStation?.id === station.id && isPlaying">
                {{ currentSongTitle }} — {{ currentSongArtist }}
              </p>
              <div class="tags">
                <span
                  v-for="tag in station.currentSong.tags.slice(0, 3)"
                  :key="tag"
                  class="tag"
                  :data-tag="tag"
                >{{ tag }}</span>
              </div>
            </div>
            <span class="card-led" :class="{ online: station.isOnline, idle: station.isIdle }" :title="station.isOnline ? 'Live' : station.isIdle ? 'Idle' : 'Offline'"></span>
          </div>
        </div>
      </template>

    </main>

    <audio ref="audioRef" style="display: none;"></audio>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import gsap from 'gsap'
import { useAudioStore } from '../stores/audio'
import { useBrandsStore } from '../stores/brands'
import { getStreamUrl } from '@/config/stream.js'

export default {
  name: 'Home',

  setup() {
    const audioStore = useAudioStore()
    const brandsStore = useBrandsStore()

    const stations      = ref([])
    const loading       = computed(() => brandsStore.loading)
    const error         = computed(() => brandsStore.error)
    const isPlaying     = computed(() => audioStore.isPlaying)
    const currentStation = computed(() => audioStore.currentStation)
    const currentSongTitle  = computed(() => audioStore.currentSong.title  || 'Loading...')
    const currentSongArtist = computed(() => audioStore.currentSong.artist || 'Unknown')

    const title        = ref(null)
    const stationGrid  = ref(null)
    const stationCards = ref([])
    const audioRef     = ref(null)

    const expandedStation = ref(null)
    const expandedCardEl  = ref(null)
    const detailEl        = ref(null)
    const chatMessages    = ref(null)
    const chatMessage     = ref('')

    const sendMessage = () => {
      const msg = chatMessage.value.trim()
      if (!msg) return
      chatMessage.value = ''
    }

    const attachFile = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      // placeholder — wire to WS upload handler
      event.target.value = ''
    }

    let ctx

    // ── fetch ──────────────────────────────────────────────
    const fetchStations = async () => {
      try {
        await brandsStore.fetchAll()
        stations.value = brandsStore.getEntries.map(brand => ({
          id:       brand.id || brand.slugName,
          name:     brand.localizedName?.en || brand.slugName,
          slug:     brand.slugName,
          djName:   brand.djName || '',
          description: brand.description || '',
          color:     brand.color || '#FF4757',
          titleFont: brand.titleFont || '',
          audioUrl:  getStreamUrl(brand.slugName),
          isOnline: brand.status === 'ON_LINE',
          isIdle:   brand.status === 'IDLE',
          status:   brand.status,
          currentSong: {
            title:  brand.status === 'ON_LINE' ? 'Streaming Live' : brand.status === 'IDLE' ? 'Idle' : 'Offline',
            artist: '',
            tags:   []
          }
        }))
      } catch (err) {
        console.error('Error fetching stations:', err)
      }
    }

    let shakeTween = null
    let shakeTimeout = null

    const startRandomShake = () => {
      if (!stationCards.value?.length || expandedStation.value) return

      const card = stationCards.value[Math.floor(Math.random() * stationCards.value.length)]
      if (!card) return

      shakeTween = gsap.to(card, {
        x: 'random(-3, 3)',
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(card, { x: 0, duration: 0.2, ease: 'power2.out' })
          shakeTimeout = setTimeout(startRandomShake, Math.random() * 2000 + 1000)
        }
      })
    }

    const stopRandomShake = () => {
      if (shakeTween) {
        shakeTween.kill()
        shakeTween = null
      }
      if (shakeTimeout) {
        clearTimeout(shakeTimeout)
        shakeTimeout = null
      }
      if (stationCards.value?.length) {
        stationCards.value.forEach(card => gsap.to(card, { x: 0, duration: 0.2 }))
      }
    }

    // ── open station ───────────────────────────────────────
    const goToStation = (station, event) => {
      const cardEl = event?.currentTarget
      openStation(station, cardEl)
    }

    const openStation = async (station, cardEl) => {
      if (!station || !cardEl || expandedStation.value?.id === station.id) return

      stopRandomShake()

      const color = getComputedStyle(cardEl).getPropertyValue('--color')?.trim()
      expandedStation.value = { ...station, _color: color || station.color }
      expandedCardEl.value  = cardEl

      await nextTick()

      const detail = detailEl.value
      if (!detail) return

      // fade panel itself in
      gsap.fromTo(detail, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })

      // stagger everything in
      const items = detail.querySelectorAll(
        '.detail-close, .detail-status-pill, .detail-name, .detail-country, .detail-play-wrap, .detail-section'
      )
      gsap.fromTo(items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.055, ease: 'power3.out', delay: 0.05 }
      )
    }

    const closeStation = async () => {
      const detail = detailEl.value

      if (!detail) {
        expandedStation.value = null
        expandedCardEl.value  = null
        return
      }

      const items = detail.querySelectorAll(
        '.detail-close, .detail-status-pill, .detail-name, .detail-country, .detail-play-wrap, .detail-section'
      )
      await new Promise(resolve => {
        gsap.to(items, { y: -12, opacity: 0, duration: 0.2, stagger: 0.025, ease: 'power2.in', onComplete: resolve })
      })

      expandedStation.value = null
      expandedCardEl.value  = null

      await nextTick()

      // smoothly animate cards in — no flicker
      if (stationCards.value?.length) {
        gsap.fromTo(stationCards.value,
          { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
        )
      }

      setTimeout(() => startRandomShake(), 600)
    }

    // ── audio ──────────────────────────────────────────────
    const quickPlay = async (station, event) => {
      event.stopPropagation()
      if (audioRef.value) audioStore.initializeAudio(audioRef.value)
      await audioStore.togglePlayback(station)
    }

    const quickPlayDetail = async () => {
      if (audioRef.value) audioStore.initializeAudio(audioRef.value)
      await audioStore.togglePlayback(expandedStation.value)
    }

    // ── keyboard ───────────────────────────────────────────
    const handleKeydown = (e) => {
      if (e.key === 'Escape' && expandedStation.value) {
        e.preventDefault()
        closeStation()
      }
    }

    // ── polling ────────────────────────────────────────────
    let pollInterval = null

    const pollStations = async () => {
      await brandsStore.patch()
      brandsStore.getEntries.forEach(brand => {
        const station = stations.value.find(s => s.slug === brand.slugName)
        if (!station) return
        station.isOnline = brand.status === 'ON_LINE'
        station.isIdle   = brand.status === 'IDLE'
        station.status   = brand.status
        station.currentSong.title =
          brand.status === 'ON_LINE' ? 'Streaming Live' :
          brand.status === 'IDLE'    ? 'Idle'           : 'Offline'
      })
    }

    // ── lifecycle ──────────────────────────────────────────
    onMounted(async () => {
      await fetchStations()
      pollInterval = setInterval(pollStations, 60_000)

      if (audioRef.value) audioStore.initializeAudio(audioRef.value)

      ctx = gsap.context(() => {
        if (title.value) {
          gsap.from(title.value, { y: -30, opacity: 0, duration: 0.9, ease: 'power3.out' })
        }
        nextTick(() => {
          if (stationCards.value?.length) {
            gsap.from(stationCards.value, {
              y: 40,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              delay: 0.1,
              ease: 'power3.out'
            })
          }
        })
      })

      window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
      clearInterval(pollInterval)
      window.removeEventListener('keydown', handleKeydown)
      ctx?.revert()
      audioStore.stopPlayback()
    })

    return {
      stations, loading, error,
      isPlaying, currentStation, currentSongTitle, currentSongArtist,
      title, stationGrid, stationCards, audioRef,
      expandedStation, detailEl, chatMessages, chatMessage,
      fetchStations, goToStation, quickPlay, quickPlayDetail, closeStation, sendMessage, attachFile
    }
  }
}
</script>

<style scoped>
/* ── base ────────────────────────────────────────────────── */
.home {
  min-height: 100vh;
  background: #101010;
  padding: 2rem;
}

.home.station-expanded {
  padding: 1rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.header-text {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(232, 222, 222, 0.5);
  font-family: 'Kaylon', sans-serif;
  letter-spacing: 0.25em;
}

.logo-svg {
  width: 32px;
  height: 32px;
  color: rgba(232, 222, 222, 0.55);
  overflow: visible;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── grid ────────────────────────────────────────────────── */
.station-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ── card ────────────────────────────────────────────────── */
.station-card {
  --blur: 1rem;
  --box-blur: calc(0.5 * var(--blur));
  --glow: var(--color, #ff4757);

  border-radius: 10px;
  border: 2px solid currentColor;
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.15),
          0 0 0 1px rgba(0,0,0,0.15),
    inset 0 0 var(--box-blur) var(--glow),
          0 0 var(--box-blur) var(--glow);
  color: var(--color, white);
  cursor: pointer;
  transition: transform 0.25s ease, --blur 0.25s ease, background 0.2s ease;
  overflow: hidden;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.station-card:hover {
  transform: translateX(4px);
  --blur: 1.6rem;
  background: rgba(255,255,255,0.04);
}

.station-card.offline {
  --glow: color-mix(in srgb, var(--color, #ff4757) 35%, transparent);
  border-color: color-mix(in srgb, var(--color, #ff4757) 35%, transparent);
  opacity: 0.75;
}

.station-card.offline:hover {
  opacity: 1;
}


/* ── station image area ──────────────────────────────────── */
.station-image {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  overflow: hidden;
}

.mood-gradient {
  width: 100%;
  height: 100%;
  background: color-mix(in srgb, var(--color, #ff4757) 30%, transparent);
  transition: transform 0.3s ease;
}

.station-card:hover .mood-gradient { transform: scale(1.15); }

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: background 0.3s ease;
}

.station-card:hover .play-overlay { background: rgba(0,0,0,0.45); }
.play-overlay .play-btn { pointer-events: auto; }

/* ── play button ─────────────────────────────────────────── */
.play-btn {
  width: 36px;
  height: 36px;
  background: rgba(0,0,0,0.85);
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.play-btn:hover {
  transform: scale(1.18);
  background: rgba(0,0,0,1);
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 14px rgba(255,255,255,0.15);
}

.play-btn:active {
  transform: scale(0.94);
}

.play-btn.playing {
  background: #ff4757;
  border-color: #ff4757;
  animation: pulse-play 1.5s ease-in-out infinite;
}

@keyframes pulse-play {
  0%, 100% { box-shadow: 0 0 12px rgba(255,71,87,0.8), 0 0 24px rgba(255,71,87,0.5); }
  50%       { box-shadow: 0 0 20px rgba(255,71,87,1),   0 0 40px rgba(255,71,87,0.7); }
}

.play-btn svg { width: 14px; height: 14px; margin-left: 1px; }

/* ── card info ───────────────────────────────────────────── */
.station-info {
  flex: 1;
  padding: 0 1rem;
  color: inherit;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.station-info h3 {
  font-size: 0.95rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 0 var(--blur) var(--glow);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.current-song {
  font-size: 0.75rem;
  opacity: 0.6;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: nowrap;
  margin-right: 0.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-weight: 500;
  text-transform: lowercase;
}

/* tag colors */
.tag[data-tag="chill"],.tag[data-tag="relax"],.tag[data-tag="peaceful"],
.tag[data-tag="sleep"],.tag[data-tag="smooth"],.tag[data-tag="classy"] {
  background: rgba(79,195,247,0.2); color: #4FC3F7; border: 1px solid #4FC3F7;
}
.tag[data-tag="rock"],.tag[data-tag="energetic"],.tag[data-tag="power"],
.tag[data-tag="guitar"],.tag[data-tag="classic"] {
  background: rgba(255,107,107,0.2); color: #FF6B6B; border: 1px solid #FF6B6B;
}
.tag[data-tag="dark"],.tag[data-tag="ambient"],.tag[data-tag="atmospheric"],
.tag[data-tag="deep"],.tag[data-tag="mysterious"] {
  background: rgba(74,20,140,0.2); color: #9C27B0; border: 1px solid #9C27B0;
}
.tag[data-tag="dance"],.tag[data-tag="party"],.tag[data-tag="bass"],
.tag[data-tag="upbeat"] {
  background: rgba(255,217,61,0.2); color: #FFD93D; border: 1px solid #FFD93D;
}
.tag[data-tag="sad"],.tag[data-tag="emotional"],.tag[data-tag="heartbreak"],
.tag[data-tag="melancholy"],.tag[data-tag="rain"] {
  background: rgba(108,99,255,0.2); color: #6C63FF; border: 1px solid #6C63FF;
}
.tag[data-tag="jazz"],.tag[data-tag="saxophone"],.tag[data-tag="study"] {
  background: rgba(0,188,212,0.2); color: #00BCD4; border: 1px solid #00BCD4;
}

/* ── status LED ──────────────────────────────────────────── */
.card-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 1.1rem;
  background: rgba(255,255,255,0.15);
  box-shadow: none;
  transition: background 0.3s, box-shadow 0.3s;
}

.card-led.online {
  background: #00e676;
  box-shadow: 0 0 6px 2px rgba(0,230,118,0.7), 0 0 12px rgba(0,230,118,0.4);
  animation: led-pulse 2s ease-in-out infinite;
}

.card-led.idle {
  background: #ffb300;
  box-shadow: 0 0 6px 2px rgba(255,179,0,0.7), 0 0 12px rgba(255,179,0,0.4);
  animation: led-pulse-idle 2s ease-in-out infinite;
}

@keyframes led-pulse-idle {
  0%, 100% { box-shadow: 0 0 5px 2px rgba(255,179,0,0.7), 0 0 10px rgba(255,179,0,0.4); }
  50%       { box-shadow: 0 0 9px 3px rgba(255,179,0,0.9), 0 0 18px rgba(255,179,0,0.6); }
}

@keyframes led-pulse {
  0%, 100% { box-shadow: 0 0 5px 2px rgba(0,230,118,0.7), 0 0 10px rgba(0,230,118,0.4); }
  50%       { box-shadow: 0 0 9px 3px rgba(0,230,118,0.9), 0 0 18px rgba(0,230,118,0.6); }
}

/* ── DETAIL PANEL ────────────────────────────────────────── */
.station-detail {
  position: relative;
  width: 100%;
  height: calc(100dvh - 2rem); /* fits within station-expanded padding */
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 4px solid var(--card-color, #FF4757);
  box-shadow:
    inset 0 0 0 2px rgba(0,0,0,0.15),
          0 0 0 2px rgba(0,0,0,0.15),
    inset 0 0 40px color-mix(in srgb, var(--card-color, #FF4757) 20%, transparent),
          0 0 40px color-mix(in srgb, var(--card-color, #FF4757) 30%, transparent);
  background: rgba(0,0,0,0.5);
  overflow: hidden;
}

/* close button */
.detail-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.5);
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.detail-close:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-color: rgba(255,255,255,0.4);
}

.detail-close svg { width: 16px; height: 16px; }

/* header */
.detail-header {
  position: relative;
  min-height: clamp(140px, 28dvh, 320px);
  display: flex;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw, 2rem);
  padding: clamp(1rem, 3vw, 2.5rem);
  overflow: hidden;
  flex-shrink: 0;
}

.detail-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 40% 60%,
    color-mix(in srgb, var(--card-color, #FF4757) 25%, transparent),
    transparent 70%
  );
  pointer-events: none;
}

/* play button in detail — larger */
.detail-play-btn {
  width: clamp(52px, 10vw, 88px);
  height: clamp(52px, 10vw, 88px);
  flex-shrink: 0;
  border-width: 2.5px;
  border-color: color-mix(in srgb, var(--card-color, #FF4757) 60%, white 40%);
}

.detail-play-btn svg { width: clamp(20px, 4vw, 32px); height: clamp(20px, 4vw, 32px); margin-left: 3px; }

.detail-play-btn:hover {
  transform: scale(1.1);
  border-color: var(--card-color, #FF4757);
  box-shadow: 0 0 30px color-mix(in srgb, var(--card-color, #FF4757) 60%, transparent);
}

.detail-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* status pill */
.detail-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  width: fit-content;
}

.detail-status-pill.online {
  background: rgba(0,230,118,0.15);
  color: #00e676;
  border: 1px solid rgba(0,230,118,0.3);
}

.detail-status-pill.offline {
  background: rgba(255,71,87,0.15);
  color: #ff4757;
  border: 1px solid rgba(255,71,87,0.3);
}

.detail-status-pill.idle {
  background: rgba(255,179,0,0.15);
  color: #ffb300;
  border: 1px solid rgba(255,179,0,0.3);
}

.status-dot-sm {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1.4s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.detail-name {
  font-size: clamp(1.3rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  text-shadow: 0 0 40px color-mix(in srgb, var(--card-color, #FF4757) 60%, transparent);
  line-height: 1.1;
  margin: 0;
}

.detail-country {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
  letter-spacing: 1px;
}

/* body */
.detail-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: clamp(0.75rem, 2vw, 2rem) clamp(0.75rem, 2.5vw, 2.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(0.75rem, 2vw, 2rem);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail-chat {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--card-color, #FF4757) 80%, white 20%);
  opacity: 0.8;
}

.detail-track {
  font-size: 1rem;
  color: white;
  opacity: 0.9;
  margin: 0;
}

.detail-meta {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

.detail-tags {
  justify-content: flex-start;
}

/* ── chat ───────────────────────────────────────────────── */
.chat-dj-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.chat-dj-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 500;
}

.chat-dj-status.offline { color: rgba(255,255,255,0.3); }
.chat-dj-status.online  { color: #00e676; }

.chat-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.chat-dj-status.online .chat-status-dot {
  animation: blink 1.4s ease-in-out infinite;
}

.chat-messages {
  flex: 1;
  min-height: 80px;
  max-height: none;
  overflow-y: auto;
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 8px;
  padding: 12px;
  background: rgba(0,0,0,0.3);
}

.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.chat-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-empty p {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.2);
  letter-spacing: 1px;
  margin: 0;
}

.chat-input-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
}

.chat-attach-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.chat-attach-btn:hover {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  border-color: rgba(255,255,255,0.25);
}

.chat-attach-btn svg { width: 16px; height: 16px; }

.chat-input {
  flex: 1;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 8px;
  padding: 10px 14px;
  color: white;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input::placeholder { color: rgba(255,255,255,0.25); }
.chat-input:focus { border-color: var(--card-color, #FF4757); }

.chat-send-btn {
  padding: 0 16px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: var(--card-color, #FF4757);
  color: #000;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
}

.chat-send-btn:hover { transform: scale(1.08); }
.chat-send-btn:active { transform: scale(0.93); }

/* ── loading / error ─────────────────────────────────────── */
.loading-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  height: 64px;
  animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
}

@keyframes skeleton-pulse {
  from { opacity: 0.3; }
  to   { opacity: 0.7; }
}

.error {
  text-align: center;
  color: white;
  padding: 3rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: #ff4757;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover { background: #ff3838; }

/* ── responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .home { padding: 1rem; }
  .home.station-expanded { padding: 0.5rem; }

  .station-grid { gap: 0.4rem; }
  .station-info { gap: 0.5rem; }
  .station-info h3 { max-width: none; }

  .station-detail {
    height: calc(100dvh - 1rem);
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    min-height: unset;
  }

  .detail-body {
    grid-template-columns: 1fr;
  }
}
</style>