import React, { useState, useEffect } from 'react'
import { TimeSplit } from './typings/global'
import { getTwoDaysFromNow, parseTimeRemaining } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './graphql/productReleaseDate.graphql'

interface CountdownProps {}

const CSS_HANDLES = ['container']
const DEFAULT_TARGET_DATE = getTwoDaysFromNow()

const Countdown: StorefrontFunctionComponent<CountdownProps> = () => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct()

  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr: false
  })

  useEffect(() => {
    const targetDate = data?.product?.releaseDate || DEFAULT_TARGET_DATE
    const interval = setInterval(() => {
      const finalDate = new Date(targetDate)
      const now = new Date()
      const secondsLeft = (finalDate.getTime() - now.getTime()) / 1000
      setTime(parseTimeRemaining(secondsLeft))
    }, 1000)
    return () => clearInterval(interval)
  }, [data])

  if (!product) {
    return <div><span>There is no product context.</span></div>
  }

  if (loading) {
    return <div><span>Loading...</span></div>
  }

  if (error) {
    return <div><span>Erro!</span></div>
  }

  return (
    <div className={`${handles.container} f2 c-muted-1 db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Countdown  