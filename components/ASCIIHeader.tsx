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
    <div className={`ascii-art whitespace-pre text-xs sm:text-sm ${className}`}>
      {text === 'DORAYAKI' ? asciiTitle : (
        <div className="text-lg font-bold">
          {`# ${text.toUpperCase()}`}
        </div>
      )}
    </div>
  )
}