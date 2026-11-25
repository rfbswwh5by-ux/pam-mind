import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import BookCover from "@/components/site/BookCover";

const SLOTS = [
  { cls: "left-[2%] top-[14%] w-[38%] z-10", rot: -7, depth: 10, delay: 0.5 },
  { cls: "left-[31%] top-[2%] w-[42%] z-30", rot: 0, depth: 22, delay: 0.35 },
  { cls: "right-[1%] top-[20%] w-[36%] z-20", rot: 6, depth: 14, delay: 0.65 },
];

function Floating({ book, slot, mx, my, reduce }) {
  const x = useTransform(mx, [-1, 1], [-slot.depth, slot.depth]);
  const y = useTransform(my, [-1, 1], [-slot.depth * 0.6, slot.depth * 0.6]);
  return (
    <motion.div
      className={`absolute ${slot.cls}`}
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0, y: reduce ? 0 : 40, rotate: slot.rot }}
      animate={{ opacity: 1, y: 0, rotate: slot.rot }}
      transition={{ duration: 1.4, delay: slot.delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/books/${book.slug}`} className="block transition-transform duration-700 hover:-translate-y-2" aria-label={book.title}>
        <BookCover book={book} sizeTitle="text-lg sm:text-2xl" />
      </Link>
    </motion.div>
  );
}

export default function HeroBooks({ books }) {
  const reduce = useReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  return (
    <div className="relative mx-auto aspect-[1.1/1] w-full max-w-[560px]" onMouseMove={reduce ? undefined : onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <div className="absolute inset-x-[8%] bottom-[6%] top-[12%] rounded-full bg-[radial-gradient(circle_at_50%_60%,rgba(155,143,180,0.28),transparent_65%)]" aria-hidden="true" />
      <div className="absolute bottom-[10%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-taupe/70 to-transparent" aria-hidden="true" />
      {books.map((b, i) => (
        <Floating key={b.id} book={b} slot={SLOTS[i]} mx={mx} my={my} reduce={reduce} />
      ))}
    </div>
  );
}