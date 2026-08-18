'use client'

import { motion } from 'framer-motion'
import { profile } from '@/config/profile'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ProfileInfo() {
  return (
    <motion.div
      className="mt-16 px-6 pb-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        className="font-serif text-2xl font-bold text-primary"
        variants={item}
      >
        {profile.name}
      </motion.h1>
      <motion.p
        className="mt-0.5 text-base font-semibold text-accent"
        variants={item}
      >
        {profile.title}
      </motion.p>
      <motion.p
        className="text-sm font-medium text-gray-500"
        variants={item}
      >
        {profile.company}
      </motion.p>
      <motion.p
        className="mt-3 text-sm leading-relaxed text-gray-600"
        variants={item}
      >
        {profile.description}
      </motion.p>
    </motion.div>
  )
}
