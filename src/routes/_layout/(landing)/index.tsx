import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/_layout/(landing)/')({
  component: LandingPage,
})

interface FeatureProps {
  title: string
  icon: string
  description: string
  isSelected: boolean
  onClick: () => void
}

const Feature = ({
  title,
  icon,
  description,
  isSelected,
  onClick,
}: FeatureProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative flex flex-col items-center border border-gray-300 p-6 ${
      isSelected
        ? 'z-20 -translate-y-1 bg-black text-white shadow-[2px_2px_0_rgba(0,0,0,1)]'
        : 'z-10 bg-white text-black shadow-[1px_1px_0_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.3)]'
    }`}
    onClick={onClick}
  >
    <span className="mb-3 text-4xl">{icon}</span>
    <h3 className="mb-2 font-mono text-lg lowercase">{title}</h3>
    <p className="font-mono text-sm opacity-80">{description}</p>
  </motion.button>
)

const WindowControls = () => {
  const navigate = Route.useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
  ]

  return (
    <div className="relative -mx-6 -mt-6 border-b-2 border-gray-800 px-4 pb-3 pt-3">
      <div className="flex items-center justify-end">
        <div
          className="h-4 w-4 cursor-pointer rounded-full bg-black transition-opacity hover:opacity-80"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 top-10 z-50 w-48 border-2 border-gray-800 bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]"
          >
            {menuItems.map((item) => (
              <button
                key={item.path}
                className="w-full px-4 py-2 text-left font-mono transition-colors hover:bg-gray-100"
                onClick={() => {
                  navigate({ to: `/${item.path}` })
                  setIsOpen(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// const RootComponent = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto bg-white border-2 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,1)]"
//       >
//         <WindowControls />
//         <div className="p-6">
//           <Outlet />
//           <footer className="text-center text-gray-500 mt-16 font-mono">
//             <a
//               href={import.meta.url.replace("esm.town", "val.town")}
//               className="hover:text-gray-700 transition-colors"
//             >
//               view source
//             </a>
//           </footer>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

export default function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState('create')

  const features = {
    create: {
      icon: '🤖',
      description: 'ai agent to create typed data from natural language',
    },
    store: {
      icon: '💾',
      description: 'local-first, decentralized data storage',
    },
    ask: {
      icon: '❓',
      description: 'ai agent to ask questions about your inventory',
    },
    generate: {
      icon: '✨',
      description: 'ai agent to generate ui for your data structures',
    },
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-16 text-center"
      >
        <motion.h1
          className="relative mb-4 inline-block cursor-pointer font-mono text-7xl font-bold lowercase"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          everything
        </motion.h1>
        <motion.p className="font-mono text-xl text-gray-600">
          apps and packages for creating and defining things
        </motion.p>
      </motion.div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
        <AnimatePresence>
          {Object.entries(features).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Feature
                title={key}
                icon={value.icon}
                description={value.description}
                isSelected={selectedFeature === key}
                onClick={() => setSelectedFeature(key)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
