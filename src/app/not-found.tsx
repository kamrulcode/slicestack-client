"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";
import { GoHomeButton } from "@/components/utils/GoHomeBtn";
import { cn } from "cn";

const Float = ({
  children,
  delay = 0,
  duration = 4,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.g
    className={className}
    animate={{ y: [0, -9, 0], rotate: [0, 3, 0] }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.g>
);

function PizzaIllustration() {
  return (
    <svg
      viewBox="0 0 1024 390"
      className="h-auto w-full overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFB32C" />
          <stop offset=".5" stopColor="#FF850E" />
          <stop offset="1" stopColor="#F0440C" />
        </linearGradient>

        <linearGradient id="number" x1="0" y1="0" x2="0.8" y2="1">
          <stop stopColor="#FFB52C" />
          <stop offset=".65" stopColor="#FF850E" />
          <stop offset="1" stopColor="#F34A13" />
        </linearGradient>

        <linearGradient id="cheese" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF28B" />
          <stop offset=".6" stopColor="#FFCA35" />
          <stop offset="1" stopColor="#F79A17" />
        </linearGradient>

        <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFB14A" />
          <stop offset=".55" stopColor="#F77C19" />
          <stop offset="1" stopColor="#CF4D13" />
        </linearGradient>

        <linearGradient id="pepperoni" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F94A39" />
          <stop offset="1" stopColor="#B9151D" />
        </linearGradient>

        <linearGradient id="shoe" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#A65C3E" />
          <stop offset="1" stopColor="#65382F" />
        </linearGradient>

        <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx="510"
        cy="365"
        rx="340"
        ry="18"
        fill="#F5B99B"
        opacity=".3"
        filter="url(#shadow)"
      />

      {/* Background storefront */}
      <g opacity=".17">
        <path d="M827 194 L897 105 L970 194Z" fill="#FFB5A8" />
        <path d="M850 191 L897 130 L950 191" stroke="#EF938D" strokeWidth="8" />
        <path d="M849 192 H970 V339 H849Z" fill="#F5B5A9" />
        <path d="M832 194 H982" stroke="#EF938D" strokeWidth="12" />
        <path d="M850 202 Q850 235 870 235 Q890 235 890 202" fill="#F18F8D" />
        <path d="M892 202 Q892 235 912 235 Q932 235 932 202" fill="#F18F8D" />
        <path d="M934 202 Q934 235 954 235 Q974 235 974 202" fill="#F18F8D" />
        <rect x="878" y="253" width="36" height="86" rx="4" fill="#FFF1E7" />
        <rect x="923" y="253" width="35" height="86" rx="4" fill="#FFF1E7" />
        <path
          d="M897 254 V338 M940 254 V338"
          stroke="#EF938D"
          strokeWidth="4"
        />
      </g>

      {/* Background cloud */}
      <path
        d="M700 130 C700 78 747 38 786 54 C812 13 877 40 884 88 C921 88 901 153 855 159 L735 159Z"
        fill="#FFECE3"
        opacity=".75"
      />

      {/* Floating decorations */}
      <Float delay={0.4}>
        <g transform="translate(305 60) rotate(-20)">
          <circle r="24" fill="#C92025" />
          <circle r="18" fill="#F43D34" />
          <circle cx="-8" cy="-6" r="3" fill="#A81520" />
          <circle cx="7" cy="-8" r="3" fill="#A81520" />
          <circle cx="4" cy="7" r="3" fill="#A81520" />
          <circle cx="-9" cy="8" r="3" fill="#A81520" />
        </g>
      </Float>

      <Float delay={1}>
        <g transform="translate(150 210) rotate(30)">
          <ellipse rx="18" ry="12" fill="#D7252C" />
          <ellipse rx="13" ry="8" fill="#FF5142" />
          <circle cx="-5" cy="-2" r="2" fill="#A81920" />
          <circle cx="5" cy="3" r="2" fill="#A81920" />
        </g>
      </Float>

      <Float delay={0.8}>
        <g transform="translate(200 105)">
          <path
            d="M0 0 C-28 -28 -22 8 0 10 C5 -7 25 -18 15 -3 C10 8 3 13 0 10Z"
            fill="#78AC28"
          />
          <path d="M0 5 L-11 -7 M0 5 L11 -5" stroke="#487A1D" strokeWidth="2" />
        </g>
      </Float>

      <Float delay={1.5}>
        <g transform="translate(808 175)">
          <path
            d="M0 0 C-27 -23 -22 9 0 12 C8 -7 25 -16 17 -2 C12 8 3 14 0 12Z"
            fill="#78A52C"
          />
          <path d="M0 8 L-12 -5 M0 8 L13 -6" stroke="#487A1D" strokeWidth="2" />
        </g>
      </Float>

      {/* Sparkles */}
      <g fill="#FF9A14">
        <path d="M397 91 L401 101 L411 105 L401 109 L397 119 L393 109 L383 105 L393 101Z" />
        <path d="M636 92 L640 102 L650 106 L640 110 L636 120 L632 110 L622 106 L632 102Z" />
        <path d="M596 48 L600 57 L609 61 L600 65 L596 74 L592 65 L583 61 L592 57Z" />
      </g>

      {/* Hand-drawn confused symbol */}
      <path
        d="M458 53 C467 32 509 30 509 44 C508 56 462 51 462 68 C465 81 501 75 500 61 C498 51 477 62 476 73 C477 83 493 81 493 89"
        stroke="#381B19"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Left 4 */}
      <motion.g
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <text
          x="185"
          y="315"
          fontSize="260"
          fontWeight="950"
          fontFamily="Arial Black, Arial, sans-serif"
          fill="url(#number)"
          stroke="#F28B15"
          strokeWidth="5"
          paintOrder="stroke"
        >
          4
        </text>
        <path
          d="M293 112 Q322 100 348 118"
          stroke="#FFCC63"
          strokeWidth="5"
          strokeLinecap="round"
          opacity=".6"
        />
      </motion.g>

      {/* Right 4 */}
      <motion.g
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <text
          x="581"
          y="315"
          fontSize="260"
          fontWeight="950"
          fontFamily="Arial Black, Arial, sans-serif"
          fill="url(#number)"
          stroke="#F28B15"
          strokeWidth="5"
          paintOrder="stroke"
        >
          4
        </text>
      </motion.g>

      {/* Pizza box */}
      <g transform="translate(694 283)">
        <path
          d="M0 40 L104 12 L171 31 L76 63Z"
          fill="#F4B45C"
          stroke="#BD6C27"
          strokeWidth="2"
        />
        <path
          d="M76 63 L171 31 L171 57 L76 83Z"
          fill="#EBA34C"
          stroke="#BD6C27"
          strokeWidth="2"
        />
        <path
          d="M0 40 L76 63 L76 83 L0 61Z"
          fill="#F9C77A"
          stroke="#BD6C27"
          strokeWidth="2"
        />
        <path
          d="M12 36 L61 -37 L174 -29 L104 12Z"
          fill="#FFD59A"
          stroke="#BD6C27"
          strokeWidth="2"
        />
        <path
          d="M61 -37 L174 -29 L104 12"
          fill="#FFE1B2"
          stroke="#BD6C27"
          strokeWidth="2"
        />
        <path d="M100 -5 L129 -12 L108 8Z" fill="#E97536" />
        <path d="M105 -2 L117 -6 L109 3Z" fill="#F9B03C" />
        <path
          d="M42 48 Q55 43 63 53 Q75 57 82 47"
          stroke="#F8C62F"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      {/* Pizza character */}
      <motion.g
        animate={{ y: [0, -5, 0], rotate: [0, 1.2, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Legs */}
        <path
          d="M468 304 Q452 333 462 351"
          stroke="#45302D"
          strokeWidth="19"
          strokeLinecap="round"
        />
        <path
          d="M549 302 Q572 328 563 351"
          stroke="#45302D"
          strokeWidth="19"
          strokeLinecap="round"
        />

        {/* Left shoe */}
        <path
          d="M452 326 Q420 316 421 347 Q422 372 450 382 Q482 394 495 371 Q500 351 476 340Z"
          fill="url(#shoe)"
          stroke="#442B27"
          strokeWidth="4"
        />
        <path
          d="M423 354 Q440 375 477 374"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M442 342 L459 351 M450 335 L468 345"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Right shoe */}
        <path
          d="M544 329 Q577 315 595 344 Q608 365 583 381 Q555 395 535 371 Q521 350 544 329Z"
          fill="url(#shoe)"
          stroke="#442B27"
          strokeWidth="4"
        />
        <path
          d="M543 372 Q565 382 594 356"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M556 342 L572 351 M565 336 L582 345"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Pizza cheese body */}
        <path
          d="M414 165 Q422 139 455 141 L565 145 Q593 148 589 181 L582 251 Q576 279 552 305 L516 350 Q505 366 491 348 L449 302 Q427 277 421 244Z"
          fill="url(#cheese)"
          stroke="#ECA02C"
          strokeWidth="4"
        />

        {/* Cheese drips */}
        <path d="M437 218 Q448 239 438 253 Q429 256 427 242Z" fill="#FFD54E" />
        <path d="M570 207 Q580 227 571 242 Q560 242 563 224Z" fill="#FFCE42" />
        <path
          d="M480 311 Q487 326 493 348 Q500 359 506 344 L512 319Z"
          fill="#FBC13B"
        />

        {/* Cheese shine */}
        <path
          d="M462 160 Q488 150 507 158"
          stroke="#FFF5B1"
          strokeWidth="7"
          strokeLinecap="round"
          opacity=".8"
        />
        <path
          d="M532 174 Q550 164 566 176"
          stroke="#FFF1A3"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Crust */}
        <path
          d="M403 190 Q390 172 406 152 Q446 111 513 105 Q558 95 586 108 Q608 121 601 154 Q598 172 580 173 Q522 155 457 190 Q423 209 403 190Z"
          fill="url(#crust)"
          stroke="#BC541B"
          strokeWidth="4"
        />
        <path
          d="M405 163 Q453 115 549 110 Q574 107 588 118"
          stroke="#FFB84E"
          strokeWidth="8"
          strokeLinecap="round"
          opacity=".7"
        />

        {/* Pepperoni */}
        <g fill="url(#pepperoni)" stroke="#C51F24" strokeWidth="2">
          <circle cx="442" cy="204" r="18" />
          <circle cx="553" cy="180" r="20" />
          <circle cx="510" cy="299" r="19" />
        </g>
        <g fill="#FF8270">
          <circle cx="436" cy="198" r="4" />
          <circle cx="547" cy="173" r="4" />
          <circle cx="504" cy="293" r="4" />
        </g>
        <g fill="#A91C21">
          <circle cx="449" cy="211" r="3" />
          <circle cx="558" cy="187" r="3" />
          <circle cx="515" cy="305" r="3" />
        </g>

        {/* Face eyebrows */}
        <path
          d="M459 218 Q469 209 481 218"
          stroke="#3C1F19"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M518 218 Q530 226 541 222"
          stroke="#3C1F19"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <ellipse cx="478" cy="239" rx="10" ry="13" fill="#241719" />
        <ellipse cx="526" cy="239" rx="10" ry="13" fill="#241719" />
        <circle cx="475" cy="235" r="4" fill="white" />
        <circle cx="523" cy="235" r="4" fill="white" />

        {/* Sad mouth */}
        <path
          d="M492 267 Q502 254 516 267"
          stroke="#321C1A"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Cheeks */}
        <ellipse cx="456" cy="259" rx="10" ry="5" fill="#F58B55" opacity=".5" />
        <ellipse cx="548" cy="258" rx="10" ry="5" fill="#F58B55" opacity=".5" />

        {/* Left arm */}
        <path
          d="M435 257 Q411 248 423 226"
          stroke="#EBAE60"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M420 229 Q414 210 427 202 Q435 195 439 209 Q448 195 454 208 Q467 205 462 221 Q459 238 447 247 Q430 248 420 229Z"
          fill="white"
          stroke="#C8B6AA"
          strokeWidth="2"
        />
        <path
          d="M430 211 L438 225 M442 210 L447 225 M451 218 L451 231"
          stroke="#D9C7BC"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Right arm */}
        <path
          d="M569 258 Q591 250 588 232"
          stroke="#EBAE60"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M568 257 Q574 241 587 247 Q599 249 592 262 Q608 261 605 276 Q600 290 582 286 Q566 280 568 257Z"
          fill="white"
          stroke="#C8B6AA"
          strokeWidth="2"
        />
        <path
          d="M581 255 L588 269 M590 261 L594 275"
          stroke="#D9C7BC"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Small cheese pieces on ground */}
      <path d="M379 377 Q399 361 420 378 L406 384 L388 384Z" fill="#FFCA39" />
      <path d="M631 376 Q654 362 672 376 L655 383 L637 381Z" fill="#FFCA39" />
      <circle cx="688" cy="386" r="3" fill="#FFA522" />

      {/* Motion marks */}
      <g stroke="#F45B31" strokeWidth="4" strokeLinecap="round">
        <path d="M218 158 Q222 145 237 137" />
        <path d="M226 174 Q232 160 243 154" />
        <path d="M779 121 Q785 135 781 148" />
        <path d="M792 135 L787 149" />
        <path d="M612 180 L610 190" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf7] px-5 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -left-24 -bottom-25 h-64 w-112.5 rounded-[50%] bg-[#FFE8D9]"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute -right-24 -top-37.5 h-80 w-112.5 rounded-full bg-[#FFF0E7]"
        />
      </div>

      {/* Main content */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-5xl text-center"
      >
        {/* Illustration */}
        <div className="mx-auto w-full max-w-237.5">
          <PizzaIllustration />
        </div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-2 text-4xl font-black tracking-tight text-[#27151F] sm:text-5xl md:text-[54px]"
        >
          Page <span className="text-[#F04439]">Not</span> Found!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mx-auto mt-3 max-w-145 text-base font-medium leading-relaxed text-[#796875] sm:text-xl"
        >
          Oops! The page you are looking for doesn’t exist
          <br className="hidden sm:block" />
          or has been moved.
        </motion.p>

        {/* Home button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group/cta gap-2.5 rounded-full bg-primary  text-[15px] tracking-wide    hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14 sm:px-9 sm:text-base group h-14.5   bg-linear-to-r from-[#FF9C18] to-[#F51E50] px-8 text-base font-bold text-white shadow-[0_8px_25px_rgba(244,91,42,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(244,91,42,0.35)] hover:from-[#F98B13] hover:to-[#EA164A]",
            )}
          >
            <Home className="mr-2 h-5 w-5 fill-white" />
            Go to Home
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
