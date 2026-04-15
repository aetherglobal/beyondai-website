'use client'

import React, { useState, useEffect } from 'react'

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export const CountdownTimer: React.FC<{
  targetDate: string
  className?: string
}> = ({ targetDate, className }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { value: timeLeft.days, label: 'Day' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ]

  return (
    <div className={`flex gap-6 md:gap-10 ${className || ''}`}>
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <span className="text-3xl md:text-5xl font-bold text-primary tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </span>
          <p className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground mt-1">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  )
}
