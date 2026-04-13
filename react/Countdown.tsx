import React, { useState, useEffect } from 'react'
import { TimeSplit } from './typings/global'
import { getTwoDaysFromNow, parseTimeRemaining } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'

import useProduct from 'vtex.product-context/useProduct'

import productReleaseDate from './graphql/productReleaseDate.graphql'

interface CountdownProps {
  targetDate?: string,
}
  

const CSS_HANDLES = ['container']

const DEFAULT_TARGET_DATE = getTwoDaysFromNow()

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ targetDate = DEFAULT_TARGET_DATE }) => {

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const interval = setInterval(() => {
      const finalDate = new Date(targetDate)
      const now = new Date()
      const secondsLeft = (finalDate.getTime() - now.getTime()) / 1000
      setTime(parseTimeRemaining(secondsLeft))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className={`${handles.countdown} f2 c-muted-1 db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown