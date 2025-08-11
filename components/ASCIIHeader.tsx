interface ASCIIHeaderProps {
  text: string
  className?: string
}

export default function ASCIIHeader({ text, className = '' }: ASCIIHeaderProps) {
  const asciiTitle = `
██████╗  ██████╗ ██████╗  █████╗ ██╗   ██╗ █████╗ ██╗  ██╗██╗
██╔══██╗██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██║ ██╔╝██║
██║  ██║██║   ██║██████╔╝███████║ ╚████╔╝ ███████║█████╔╝ ██║
██║  ██║██║   ██║██╔══██╗██╔══██║  ╚██╔╝  ██╔══██║██╔═██╗ ██║
██████╔╝╚██████╔╝██║  ██║██║  ██║   ██║   ██║  ██║██║  ██╗██║
╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
  `

  return (
    <div className={`ascii-art whitespace-pre text-[0.4rem] xs:text-[0.5rem] sm:text-xs md:text-sm overflow-x-auto ${className}`}>
      {text === 'DORAYAKI' ? asciiTitle : (
        <div className="text-lg font-bold">
          {`# ${text.toUpperCase()}`}
        </div>
      )}
    </div>
  )
}