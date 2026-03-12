import { useState } from "react"

export default function Ataturk() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")

  function Click() {
    setOpen(prev => !prev)
    setText("Atatürk'ü sevmeyenin kanı bozuktur.")
  }

  const newThing = (text: string) => {
    setText("")
    setTimeout(() => {
      setText(`${text} - YO YO YO`)
    }, 200)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
      
      <div className="flex flex-col items-center gap-10 bg-neutral-800 p-10 rounded-2xl shadow-xl">

        <h1 className="text-4xl font-bold text-red-500">
          Secret Gift 🎁
        </h1>

        <button
          onClick={Click}
          className="px-6 py-3 bg-red-600 rounded-xl text-xl hover:bg-red-700 transition"
        >
          Click for the Gift
        </button>

        <img
          className="rounded-xl shadow-lg w-64"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwQbz4DnMwTBAR-JeAiaOxWKqc6YuHWc3r3A&s"
          alt="IMG"
        />

        <span className="text-2xl text-red-400 font-semibold text-center max-w-md">
          {text}
        </span>

        <button
          className="px-5 py-2 bg-white text-black rounded-lg hover:scale-105 transition"
          onClick={() => {
            const text = prompt("Give us a text")

            if (text) {
              newThing(text)
            }
          }}
        >
          Set New Text
        </button>

      </div>
    </div>
  )
}