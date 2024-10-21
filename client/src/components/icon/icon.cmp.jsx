import { getColor } from '../../utilities/core.utils'


export const Icon = ({ name, size = 20, color = '--white', style }) => {
    return (
        <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', width: +size, height: +size }}>
            {name === 'add' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="44" d="M256 112v288M400 256H112" />
            </svg>}

            {name === 'add-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M256 176v160M336 256H176" />
            </svg>}

            {name === 'albums' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M368 96H144a16 16 0 010-32h224a16 16 0 010 32zM400 144H112a16 16 0 010-32h288a16 16 0 010 32zM419.13 448H92.87A44.92 44.92 0 0148 403.13V204.87A44.92 44.92 0 0192.87 160h326.26A44.92 44.92 0 01464 204.87v198.26A44.92 44.92 0 01419.13 448z" />
            </svg>}

            {name === 'alert-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <path d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
                <path fill={getColor(color)} d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z" />
            </svg>}

            {name === 'arrow-down' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="48" d="M112 268l144 144 144-144M256 392V100" />
            </svg>}

            {name === 'arrow-forward-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M262.62 336L342 256l-79.38-80M330.97 256H170" />
                <path d="M256 448c106 0 192-86 192-192S362 64 256 64 64 150 64 256s86 192 192 192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
            </svg>}

            {name === 'arrow-up-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M176 249.38L256 170l80 79.38M256 181.03V342" />
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
            </svg>}

            {name === 'arrow-up' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <title>Arrow Up</title>
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="48" d="M112 244l144-144 144 144M256 120v292" />
            </svg>}

            {name === 'ban' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <circle fill="none" stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="48" cx="256"
                    cy="256" r="200" />
                <path stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="48"
                    d="M114.58 114.58l282.84 282.84" />
            </svg>}

            {name === 'bookmark-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z" fill="none"
                    stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
            </svg>}

            {name === 'card-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <rect x="48" y="96" width="416" height="320" rx="56" ry="56" fill="none" stroke={getColor(color)}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinejoin="round" strokeWidth="60"
                    d="M48 192h416M128 300h48v20h-48z" />
            </svg>}

            {name === 'chatbubble-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M87.48 380c1.2-4.38-1.43-10.47-3.94-14.86a42.63 42.63 0 00-2.54-3.8 199.81 199.81 0 01-33-110C47.64 139.09 140.72 48 255.82 48 356.2 48 440 117.54 459.57 209.85a199 199 0 014.43 41.64c0 112.41-89.49 204.93-204.59 204.93-18.31 0-43-4.6-56.47-8.37s-26.92-8.77-30.39-10.11a31.14 31.14 0 00-11.13-2.07 30.7 30.7 0 00-12.08 2.43L81.5 462.78a15.92 15.92 0 01-4.66 1.22 9.61 9.61 0 01-9.58-9.74 15.85 15.85 0 01.6-3.29z"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" />
                <circle fill={getColor(color)} cx="160" cy="256" r="32" />
                <circle fill={getColor(color)} cx="256" cy="256" r="32" />
                <circle fill={getColor(color)} cx="352" cy="256" r="32" />
            </svg>}

            {name === 'chatbubble' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M398 81.84A227.4 227.4 0 00255.82 32C194.9 32 138 55.47 95.46 98.09 54.35 139.33 31.82 193.78 32 251.37a215.66 215.66 0 0035.65 118.76l.19.27c.28.41.57.82.86 1.22s.65.92.73 1.05l.22.4c1.13 2 2 4.44 1.23 6.9l-18.42 66.66a29.13 29.13 0 00-1.2 7.63A25.69 25.69 0 0076.83 480a29.44 29.44 0 0010.45-2.29l67.49-24.36.85-.33a14.75 14.75 0 015.8-1.15 15.12 15.12 0 015.37 1c1.62.63 16.33 6.26 31.85 10.6 12.9 3.6 39.74 9 60.77 9 59.65 0 115.35-23.1 156.83-65.06C457.36 365.77 480 310.42 480 251.49a213.5 213.5 0 00-4.78-45c-10.34-48.62-37.76-92.9-77.22-124.65zM87.48 380zM160 288a32 32 0 1132-32 32 32 0 01-32 32zm96 0a32 32 0 1132-32 32 32 0 01-32 32zm96 0a32 32 0 1132-32 32 32 0 01-32 32z" />
            </svg>}

            {name === 'checkmark' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="44" d="M416 128L192 384l-96-96" />
            </svg>}

            {name === 'checkmark-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M352 176L217.6 336 160 272" />
            </svg>}

            {name === 'chevron-back' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="48" d="M328 112L184 256l144 144" />
            </svg>}

            {name === 'chevron-forward' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="48" d="M184 112l144 144-144 144" />
            </svg>}

            {name === 'close-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M320 320L192 192M192 320l128-128" />
            </svg>}

            {name === 'close' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
            </svg>}

            {name === 'contract' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32"
                    d="M304 416V304h112M314.2 314.23L432 432M208 96v112H96M197.8 197.77L80 80M416 208H304V96M314.23 197.8L432 80M96 304h112v112M197.77 314.2L80 432" />
            </svg>}

            {name === 'copy-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke={getColor(color)}
                    strokeLinejoin="round" strokeWidth="32" />
                <path
                    d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'easel-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <rect x="48" y="80" width="416" height="272" rx="32" ry="32" fill="none" stroke={getColor(color)}
                    strokeLinejoin="round" strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M256 416v-64M256 80V48M400 464l-32-112M112 464l32-112" />
            </svg>}

            {name === 'ellipse' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208z" />
            </svg>}

            {name === 'ellipsis-horizontal-circle' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <circle cx="256" cy="256" r="26" fill={getColor(color)} />
                <circle cx="346" cy="256" r="26" fill={getColor(color)} />
                <circle cx="166" cy="256" r="26" fill={getColor(color)} />
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
            </svg>}

            {name === 'enter-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M176 176v-40a40 40 0 0140-40h208a40 40 0 0140 40v240a40 40 0 01-40 40H216a40 40 0 01-40-40v-40"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M272 336l80-80-80-80M48 256h288" />
            </svg>}

            {name === 'exit-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'expand' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32"
                    d="M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304" />
            </svg>}

            {name === 'folder' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M496 152a56 56 0 00-56-56H220.11a23.89 23.89 0 01-13.31-4L179 73.41A55.77 55.77 0 00147.89 64H72a56 56 0 00-56 56v48a8 8 0 008 8h464a8 8 0 008-8zM16 392a56 56 0 0056 56h368a56 56 0 0056-56V216a8 8 0 00-8-8H24a8 8 0 00-8 8z" />
            </svg>}

            {name === 'folder-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M440 432H72a40 40 0 01-40-40V120a40 40 0 0140-40h75.89a40 40 0 0122.19 6.72l27.84 18.56a40 40 0 0022.19 6.72H440a40 40 0 0140 40v240a40 40 0 01-40 40zM32 192h448"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'link-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M208 352h-64a96 96 0 010-192h64M304 160h64a96 96 0 010 192h-64M163.29 256h187.42"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="36" />
            </svg>}

            {name === 'notifications' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93-22-26.61-35.31-42.67-35.31-118 0-39-9.33-71-27.72-95-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 01-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.13 3.13 0 01-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14 0 75.36-13.29 91.42-35.31 118-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 00-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 00-4.61-37.66zM256 480a80.06 80.06 0 0070.44-42.13 4 4 0 00-3.54-5.87H189.12a4 4 0 00-3.55 5.87A80.06 80.06 0 00256 480z" />
            </svg>}

            {name === 'notifications-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M427.68 351.43C402 320 383.87 304 383.87 217.35 383.87 138 343.35 109.73 310 96c-4.43-1.82-8.6-6-9.95-10.55C294.2 65.54 277.8 48 256 48s-38.21 17.55-44 37.47c-1.35 4.6-5.52 8.71-9.95 10.53-33.39 13.75-73.87 41.92-73.87 121.35C128.13 304 110 320 84.32 351.43 73.68 364.45 83 384 101.61 384h308.88c18.51 0 27.77-19.61 17.19-32.57zM320 384v16a64 64 0 01-128 0v-16"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'open-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48M336 64h112v112M224 288L440 72"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="40" />
            </svg>}

            {name === 'paper-plane' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M473 39.05a24 24 0 00-25.5-5.46L47.47 185h-.08a24 24 0 001 45.16l.41.13 137.3 58.63a16 16 0 0015.54-3.59L422 80a7.07 7.07 0 0110 10L226.66 310.26a16 16 0 00-3.59 15.54l58.65 137.38c.06.2.12.38.19.57 3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0023-15.46L478.39 64.62A24 24 0 00473 39.05z" />
            </svg>}

            {name === 'paper-plane-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M53.12 199.94l400-151.39a8 8 0 0110.33 10.33l-151.39 400a8 8 0 01-15-.34l-67.4-166.09a16 16 0 00-10.11-10.11L53.46 215a8 8 0 01-.34-15.06zM460 52L227 285"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'pencil' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="44"
                    d="M358.62 129.28L86.49 402.08 70 442l39.92-16.49 272.8-272.13-24.1-24.1zM413.07 74.84l-11.79 11.78 24.1 24.1 11.79-11.79a16.51 16.51 0 000-23.34l-.75-.75a16.51 16.51 0 00-23.35 0z" />
            </svg>}

            {name === 'people' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M336 256c-20.56 0-40.44-9.18-56-25.84-15.13-16.25-24.37-37.92-26-61-1.74-24.62 5.77-47.26 21.14-63.76S312 80 336 80c23.83 0 45.38 9.06 60.7 25.52 15.47 16.62 23 39.22 21.26 63.63-1.67 23.11-10.9 44.77-26 61C376.44 246.82 356.57 256 336 256zm66-88zM467.83 432H204.18a27.71 27.71 0 01-22-10.67 30.22 30.22 0 01-5.26-25.79c8.42-33.81 29.28-61.85 60.32-81.08C264.79 297.4 299.86 288 336 288c36.85 0 71 9 98.71 26.05 31.11 19.13 52 47.33 60.38 81.55a30.27 30.27 0 01-5.32 25.78A27.68 27.68 0 01467.83 432zM147 260c-35.19 0-66.13-32.72-69-72.93-1.42-20.6 5-39.65 18-53.62 12.86-13.83 31-21.45 51-21.45s38 7.66 50.93 21.57c13.1 14.08 19.5 33.09 18 53.52-2.87 40.2-33.8 72.91-68.93 72.91zM212.66 291.45c-17.59-8.6-40.42-12.9-65.65-12.9-29.46 0-58.07 7.68-80.57 21.62-25.51 15.83-42.67 38.88-49.6 66.71a27.39 27.39 0 004.79 23.36A25.32 25.32 0 0041.72 400h111a8 8 0 007.87-6.57c.11-.63.25-1.26.41-1.88 8.48-34.06 28.35-62.84 57.71-83.82a8 8 0 00-.63-13.39c-1.57-.92-3.37-1.89-5.42-2.89z" />
            </svg>}

            {name === 'person' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z" />
            </svg>}

            {name === 'person-add' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M288 256c52.79 0 99.43-49.71 104-110.82 2.27-30.7-7.36-59.33-27.12-80.6C345.33 43.57 318 32 288 32c-30.24 0-57.59 11.5-77 32.38-19.63 21.11-29.2 49.8-27 80.78C188.49 206.28 235.12 256 288 256zM495.38 439.76c-8.44-46.82-34.79-86.15-76.19-113.75C382.42 301.5 335.83 288 288 288s-94.42 13.5-131.19 38c-41.4 27.6-67.75 66.93-76.19 113.75-1.93 10.73.69 21.34 7.19 29.11A30.94 30.94 0 00112 480h352a30.94 30.94 0 0024.21-11.13c6.48-7.77 9.1-18.38 7.17-29.11zM104 288v-40h40a16 16 0 000-32h-40v-40a16 16 0 00-32 0v40H32a16 16 0 000 32h40v40a16 16 0 0032 0z" />
            </svg>}

            {name === 'person-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z" />
                <path fill={getColor(color)}
                    d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z" />
            </svg>}

            {name === 'person-remove' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M288 256c52.79 0 99.43-49.71 104-110.82 2.27-30.7-7.36-59.33-27.12-80.6C345.33 43.57 318 32 288 32c-30.24 0-57.59 11.5-77 32.38-19.63 21.11-29.2 49.8-27 80.78C188.49 206.28 235.12 256 288 256zM495.38 439.76c-8.44-46.82-34.79-86.15-76.19-113.75C382.42 301.5 335.83 288 288 288s-94.42 13.5-131.19 38c-41.4 27.6-67.75 66.93-76.19 113.75-1.93 10.73.69 21.34 7.19 29.11A30.94 30.94 0 00112 480h352a30.94 30.94 0 0024.21-11.13c6.48-7.77 9.1-18.38 7.17-29.11zM144 216H32a16 16 0 000 32h112a16 16 0 000-32z" />
            </svg>}

            {name === 'phone-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <rect x="128" y="16" width="256" height="480" rx="48" ry="48" fill="none" stroke={getColor(color)}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                <path d="M176 16h24a8 8 0 018 8h0a16 16 0 0016 16h64a16 16 0 0016-16h0a8 8 0 018-8h24"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'play' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" />
            </svg>}

            {name === 'play-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <path fill={getColor(color)}
                    d="M216.32 334.44l114.45-69.14a10.89 10.89 0 000-18.6l-114.45-69.14a10.78 10.78 0 00-16.32 9.31v138.26a10.78 10.78 0 0016.32 9.31z" />
            </svg>}

            {name === 'qr' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <rect x="336" y="336" width="80" height="80" rx="8" ry="8" fill={getColor(color)} />
                <rect x="272" y="272" width="64" height="64" rx="8" ry="8" fill={getColor(color)} />
                <rect x="416" y="416" width="64" height="64" rx="8" ry="8" fill={getColor(color)} />
                <rect x="432" y="272" width="48" height="48" rx="8" ry="8" fill={getColor(color)} />
                <rect x="272" y="432" width="48" height="48" rx="8" ry="8" fill={getColor(color)} />
                <rect x="336" y="96" width="80" height="80" rx="8" ry="8" fill={getColor(color)} />
                <rect x="288" y="48" width="176" height="176" rx="16" ry="16" fill="none" stroke={getColor(color)}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                <rect x="96" y="96" width="80" height="80" rx="8" ry="8" fill={getColor(color)} />
                <rect x="48" y="48" width="176" height="176" rx="16" ry="16" fill="none" stroke={getColor(color)}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
                <rect x="96" y="336" width="80" height="80" rx="8" ry="8" fill={getColor(color)} />
                <rect x="48" y="288" width="176" height="176" rx="16" ry="16" fill="none" stroke={getColor(color)}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
            </svg>}

            {name === 'radio-button-on' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <circle fill={getColor(color)} cx="256" cy="256" r="144" />
            </svg>}

            {name === 'remove-circle-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none"
                    stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M336 256H176" />
            </svg>}

            {name === 'share-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M336 192h40a40 40 0 0140 40v192a40 40 0 01-40 40H136a40 40 0 01-40-40V232a40 40 0 0140-40h40M336 128l-80-80-80 80M256 321V48"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'sync' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
                <path fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" d="M32 256l44-44 46 44M480 256l-44 44-46-44" />
            </svg>}

            {name === 'ticket-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill="none" stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32"
                    d="M366.05 146a46.7 46.7 0 01-2.42-63.42 3.87 3.87 0 00-.22-5.26l-44.13-44.18a3.89 3.89 0 00-5.5 0l-70.34 70.34a23.62 23.62 0 00-5.71 9.24h0a23.66 23.66 0 01-14.95 15h0a23.7 23.7 0 00-9.25 5.71L33.14 313.78a3.89 3.89 0 000 5.5l44.13 44.13a3.87 3.87 0 005.26.22 46.69 46.69 0 0165.84 65.84 3.87 3.87 0 00.22 5.26l44.13 44.13a3.89 3.89 0 005.5 0l180.4-180.39a23.7 23.7 0 005.71-9.25h0a23.66 23.66 0 0114.95-15h0a23.62 23.62 0 009.24-5.71l70.34-70.34a3.89 3.89 0 000-5.5l-44.13-44.13a3.87 3.87 0 00-5.26-.22 46.7 46.7 0 01-63.42-2.32z" />
                <path fill="none" stroke={getColor(color)} strokeMiterlimit="10" strokeWidth="32"
                    strokeLinecap="round"
                    d="M250.5 140.44l-16.51-16.51M294.52 184.46l-11.01-11M338.54 228.49l-11-11.01M388.07 278.01l-16.51-16.51" />
            </svg>}

            {name === 'timer-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path
                    d="M112.91 128A191.85 191.85 0 0064 254c-1.18 106.35 85.65 193.8 192 194 106.2.2 192-85.83 192-192 0-104.54-83.55-189.61-187.5-192a4.36 4.36 0 00-4.5 4.37V152"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
                <path fill={getColor(color)}
                    d="M233.38 278.63l-79-113a8.13 8.13 0 0111.32-11.32l113 79a32.5 32.5 0 01-37.25 53.26 33.21 33.21 0 01-8.07-7.94z" />
            </svg>}

            {name === 'trash-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
                <path stroke={getColor(color)} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"
                    d="M80 112h352" />
                <path
                    d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
                    fill="none" stroke={getColor(color)} strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="32" />
            </svg>}

            {name === 'tv' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M447.86 384H64.14A48.2 48.2 0 0116 335.86V128.14A48.2 48.2 0 0164.14 80h383.72A48.2 48.2 0 01496 128.14v207.72A48.2 48.2 0 01447.86 384z" />
                <path stroke={getColor(color)} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"
                    d="M128 416h256" />
            </svg>}

            {name === 'tv-o' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <rect x="32" y="96" width="448" height="272" rx="32.14" ry="32.14" fill="none"
                    stroke={getColor(color)} strokeLinejoin="round" strokeWidth="32" />
                <path stroke={getColor(color)} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"
                    d="M128 416h256" />
            </svg>}



            {/* Logo */}

            {name === 'logo-discord' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M464 66.52A50 50 0 00414.12 17L97.64 16A49.65 49.65 0 0048 65.52V392c0 27.3 22.28 48 49.64 48H368l-13-44 109 100zM324.65 329.81s-8.72-10.39-16-19.32C340.39 301.55 352.5 282 352.5 282a139 139 0 01-27.85 14.25 173.31 173.31 0 01-35.11 10.39 170.05 170.05 0 01-62.72-.24 184.45 184.45 0 01-35.59-10.4 141.46 141.46 0 01-17.68-8.21c-.73-.48-1.45-.72-2.18-1.21-.49-.24-.73-.48-1-.48-4.36-2.42-6.78-4.11-6.78-4.11s11.62 19.09 42.38 28.26c-7.27 9.18-16.23 19.81-16.23 19.81-53.51-1.69-73.85-36.47-73.85-36.47 0-77.06 34.87-139.62 34.87-139.62 34.87-25.85 67.8-25.12 67.8-25.12l2.42 2.9c-43.59 12.32-63.44 31.4-63.44 31.4s5.32-2.9 14.28-6.77c25.91-11.35 46.5-14.25 55-15.21a24 24 0 014.12-.49 205.62 205.62 0 0148.91-.48 201.62 201.62 0 0172.89 22.95s-19.13-18.15-60.3-30.45l3.39-3.86s33.17-.73 67.81 25.16c0 0 34.87 62.56 34.87 139.62 0-.28-20.35 34.5-73.86 36.19z" />
                <path fill={getColor(color)}
                    d="M212.05 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.8 0 24.7-11.83 24.7-26.57.25-14.76-10.9-26.57-24.7-26.57zM300.43 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.81 0 24.7-11.83 24.7-26.57S314 218 300.43 218z" />
            </svg>}

            {name === 'logo-facebook' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
                    fillRule="evenodd" />
            </svg>}

            {name === 'logo-github' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z" />
            </svg>}

            {name === 'logo-instagram' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z" />
                <path fill={getColor(color)}
                    d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z" />
            </svg>}

            {name === 'logo-linkedin' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z" />
            </svg>}

            {name === 'logo-reddit' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)} d="M324 256a36 36 0 1036 36 36 36 0 00-36-36z" />
                <circle fill={getColor(color)} cx="188" cy="292" r="36" transform="rotate(-22.5 187.997 291.992)" />
                <path fill={getColor(color)}
                    d="M496 253.77c0-31.19-25.14-56.56-56-56.56a55.72 55.72 0 00-35.61 12.86c-35-23.77-80.78-38.32-129.65-41.27l22-79 66.41 13.2c1.9 26.48 24 47.49 50.65 47.49 28 0 50.78-23 50.78-51.21S441 48 413 48c-19.53 0-36.31 11.19-44.85 28.77l-90-17.89-31.1 109.52-4.63.13c-50.63 2.21-98.34 16.93-134.77 41.53A55.38 55.38 0 0072 197.21c-30.89 0-56 25.37-56 56.56a56.43 56.43 0 0028.11 49.06 98.65 98.65 0 00-.89 13.34c.11 39.74 22.49 77 63 105C146.36 448.77 199.51 464 256 464s109.76-15.23 149.83-42.89c40.53-28 62.85-65.27 62.85-105.06a109.32 109.32 0 00-.84-13.3A56.32 56.32 0 00496 253.77zM414 75a24 24 0 11-24 24 24 24 0 0124-24zM42.72 253.77a29.6 29.6 0 0129.42-29.71 29 29 0 0113.62 3.43c-15.5 14.41-26.93 30.41-34.07 47.68a30.23 30.23 0 01-8.97-21.4zM390.82 399c-35.74 24.59-83.6 38.14-134.77 38.14S157 423.61 121.29 399c-33-22.79-51.24-52.26-51.24-83A78.5 78.5 0 0175 288.72c5.68-15.74 16.16-30.48 31.15-43.79a155.17 155.17 0 0114.76-11.53l.3-.21.24-.17c35.72-24.52 83.52-38 134.61-38s98.9 13.51 134.62 38l.23.17.34.25A156.57 156.57 0 01406 244.92c15 13.32 25.48 28.05 31.16 43.81a85.44 85.44 0 014.31 17.67 77.29 77.29 0 01.6 9.65c-.01 30.72-18.21 60.19-51.25 82.95zm69.6-123.92c-7.13-17.28-18.56-33.29-34.07-47.72A29.09 29.09 0 01440 224a29.59 29.59 0 0129.41 29.71 30.07 30.07 0 01-8.99 21.39z" />
                <path fill={getColor(color)}
                    d="M323.23 362.22c-.25.25-25.56 26.07-67.15 26.27-42-.2-66.28-25.23-67.31-26.27a4.14 4.14 0 00-5.83 0l-13.7 13.47a4.15 4.15 0 000 5.89c3.4 3.4 34.7 34.23 86.78 34.45 51.94-.22 83.38-31.05 86.78-34.45a4.16 4.16 0 000-5.9l-13.71-13.47a4.13 4.13 0 00-5.81 0z" />
            </svg>}

            {name === 'logo-telegram' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M473 39.05a24 24 0 00-25.5-5.46L47.47 185h-.08a24 24 0 001 45.16l.41.13 137.3 58.63a16 16 0 0015.54-3.59L422 80a7.07 7.07 0 0110 10L226.66 310.26a16 16 0 00-3.59 15.54l58.65 137.38c.06.2.12.38.19.57 3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0023-15.46L478.39 64.62A24 24 0 00473 39.05z" />
            </svg>}

            {name === 'logo-tiktok' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M412.19 118.66a109.27 109.27 0 01-9.45-5.5 132.87 132.87 0 01-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14 23.9 350 16 350.13 16h-82.44v318.78c0 4.28 0 8.51-.18 12.69 0 .52-.05 1-.08 1.56 0 .23 0 .47-.05.71v.18a70 70 0 01-35.22 55.56 68.8 68.8 0 01-34.11 9c-38.41 0-69.54-31.32-69.54-70s31.13-70 69.54-70a68.9 68.9 0 0121.41 3.39l.1-83.94a153.14 153.14 0 00-118 34.52 161.79 161.79 0 00-35.3 43.53c-3.48 6-16.61 30.11-18.2 69.24-1 22.21 5.67 45.22 8.85 54.73v.2c2 5.6 9.75 24.71 22.38 40.82A167.53 167.53 0 00115 470.66v-.2l.2.2c39.91 27.12 84.16 25.34 84.16 25.34 7.66-.31 33.32 0 62.46-13.81 32.32-15.31 50.72-38.12 50.72-38.12a158.46 158.46 0 0027.64-45.93c7.46-19.61 9.95-43.13 9.95-52.53V176.49c1 .6 14.32 9.41 14.32 9.41s19.19 12.3 49.13 20.31c21.48 5.7 50.42 6.9 50.42 6.9v-81.84c-10.14 1.1-30.73-2.1-51.81-12.61z" />
            </svg>}

            {name === 'logo-twitch' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M80 32l-32 80v304h96v64h64l64-64h80l112-112V32zm336 256l-64 64h-96l-64 64v-64h-80V80h304z" />
                <path fill={getColor(color)} d="M320 143h48v129h-48zM208 143h48v129h-48z" />
            </svg>}

            {name === 'logo-whatsapp' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M414.73 97.1A222.14 222.14 0 00256.94 32C134 32 33.92 131.58 33.87 254a220.61 220.61 0 0029.78 111L32 480l118.25-30.87a223.63 223.63 0 00106.6 27h.09c122.93 0 223-99.59 223.06-222A220.18 220.18 0 00414.73 97.1zM256.94 438.66h-.08a185.75 185.75 0 01-94.36-25.72l-6.77-4-70.17 18.32 18.73-68.09-4.41-7A183.46 183.46 0 0171.53 254c0-101.73 83.21-184.5 185.48-184.5a185 185 0 01185.33 184.64c-.04 101.74-83.21 184.52-185.4 184.52zm101.69-138.19c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54 2.78-14.4 18-17.65 21.75-6.5 4.16-12.07 1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56 2.44-11.32c2.51-2.49 5.57-6.48 8.36-9.72s3.72-5.56 5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53 20.53 0 00-14.86 6.94c-5.11 5.56-19.51 19-19.51 46.28s20 53.68 22.76 57.38 39.3 59.73 95.21 83.76a323.11 323.11 0 0031.78 11.68c13.35 4.22 25.5 3.63 35.1 2.2 10.71-1.59 33-13.42 37.63-26.38s4.64-24.06 3.25-26.37-5.11-3.71-10.69-6.48z"
                    fillRule="evenodd" />
            </svg>}

            {name === 'logo-youtube' && <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width={+size} heigth={+size} viewBox="0 0 512 512">
                <path fill={getColor(color)}
                    d="M508.64 148.79c0-45-33.1-81.2-74-81.2C379.24 65 322.74 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149 1 184.59-.06 220.19 0 255.79q-.15 53.4 3.4 106.9c0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9 178.6 3.8q91.2.3 178.6-3.8c40.9 0 74-36.5 74-81.5 2.4-35.7 3.5-71.3 3.4-107q.34-53.4-3.26-106.9zM207 353.89v-196.5l145 98.2z" />
            </svg>}

        </div>
    )
}