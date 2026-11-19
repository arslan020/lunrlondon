import { useEffect, useMemo, useState, type FormEvent } from 'react'
import AddressField from '../components/AddressField'
import { useContent } from '../content/ContentProvider'
import {
  airportDropoffFee,
  formatPrice,
  includedMilesPerHour,
  journeyPrice,
  meterRates,
  vehicleTitle,
  type AirportLeg,
  type TripType,
  type VehicleId,
} from '../data/pricing'
import { sendEnquiry } from '../lib/sendEnquiry'

const tripTypes: { id: TripType; label: string }[] = [
  { id: 'one-way', label: 'One Way' },
  { id: 'airport', label: 'Airport Pickup' },
  { id: 'hourly', label: 'Hourly' },
]

const fareCell = (amount?: number) => (amount != null ? formatPrice(amount) : '—')

const fieldClass =
  'w-full min-w-0 max-w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-brand-primary [color-scheme:dark]'

function Book() {
  const { vehicles, airports, minimumHours, book } = useContent()
  const catalog = { vehicles, airports, minimumHours }
  const [step, setStep] = useState<1 | 2>(1)
  const [tripType, setTripType] = useState<TripType>('one-way')
  const [pickup, setPickup] = useState('')
  const [pickupPlaceId, setPickupPlaceId] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [dropoffPlaceId, setDropoffPlaceId] = useState('')
  const [returnAddress, setReturnAddress] = useState('')
  const [returnPlaceId, setReturnPlaceId] = useState('')
  const [airportId, setAirportId] = useState(airports[1].id)
  const [airportLeg, setAirportLeg] = useState<AirportLeg>('pickup')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('21:15')
  const [hours, setHours] = useState(minimumHours)

  useEffect(() => {
    setHours((current) => (current < minimumHours ? minimumHours : current))
  }, [minimumHours])
  const [returning, setReturning] = useState(false)
  const [vehicleId, setVehicleId] = useState<VehicleId>('v-class')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [route, setRoute] = useState<{ miles: number; minutes: number; billedHours: number; traffic: boolean } | null>(null)
  const [routeState, setRouteState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [routeError, setRouteError] = useState('')

  const selectedAirport = airports.find((airport) => airport.id === airportId)
  const chargedHours = tripType === 'one-way' && route ? route.billedHours : undefined
  const quoteOptions = {
    tripType,
    hours,
    airportId,
    pickup,
    dropoff,
    returning,
    airportLeg: tripType === 'airport' ? airportLeg : undefined,
    chargedHours,
    miles: route?.miles,
    minutes: route?.minutes,
  }

  const selectedQuote = useMemo(
    () => journeyPrice({ ...quoteOptions, vehicleId }, catalog),
    [tripType, hours, airportId, airportLeg, pickup, dropoff, returning, vehicleId, chargedHours, route?.miles, route?.minutes, vehicles, airports, minimumHours],
  )

  useEffect(() => {
    const airportAddress = tripType === 'airport' && selectedAirport ? `${selectedAirport.name} Airport, United Kingdom` : ''
    let originPlaceId = pickupPlaceId
    let originAddress = ''
    let destinationPlaceId = dropoffPlaceId
    let destinationAddress = ''
    if (tripType === 'airport' && airportAddress && pickupPlaceId) {
      if (airportLeg === 'pickup') {
        originPlaceId = ''
        originAddress = airportAddress
        destinationPlaceId = dropoffPlaceId || pickupPlaceId
      } else {
        originPlaceId = pickupPlaceId
        destinationPlaceId = ''
        destinationAddress = airportAddress
      }
    }
    const canRoute =
      (tripType === 'one-way' && Boolean(pickupPlaceId && dropoffPlaceId)) ||
      (tripType === 'hourly' && Boolean(pickupPlaceId && dropoffPlaceId)) ||
      (tripType === 'airport' && Boolean(pickupPlaceId && airportAddress))

    if (!canRoute) {
      setRoute(null)
      setRouteState('idle')
      setRouteError('')
      return
    }

    const controller = new AbortController()
    setRouteState('loading')
    const timer = setTimeout(() => {
      void fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'route',
          originPlaceId,
          originAddress,
          destinationPlaceId,
          destinationAddress,
          date,
          time,
        }),
        signal: controller.signal,
      })
        .then(async (response) => {
          const data = (await response.json()) as {
            error?: string
            miles?: number
            minutes?: number
            billedHours?: number
            traffic?: boolean
          }
          if (!response.ok || typeof data.billedHours !== 'number') {
            setRoute(null)
            setRouteState('error')
            setRouteError(data.error || 'The route could not be calculated just now.')
            return
          }
          setRoute({
            miles: data.miles ?? 0,
            minutes: data.minutes ?? 0,
            billedHours: data.billedHours,
            traffic: Boolean(data.traffic),
          })
          setRouteState('ready')
          setRouteError('')
        })
        .catch(() => {
          if (controller.signal.aborted) return
          setRoute(null)
          setRouteState('error')
          setRouteError('The route could not be calculated just now.')
        })
    }, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [tripType, airportLeg, pickupPlaceId, dropoffPlaceId, selectedAirport, date, time])

  const goNext = (event: FormEvent) => {
    event.preventDefault()
    setStep(2)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const website = (event.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''
    const vehicle = vehicles.find((item) => item.id === vehicleId)
    const airport = airports.find((item) => item.id === airportId)
    setSending(true)
    setError('')
    try {
      await sendEnquiry({
        kind: 'booking',
        name,
        email,
        phone,
        trip: tripType === 'airport' ? `Airport ${airportLeg === 'dropoff' ? 'drop-off' : 'pickup'}` : (tripTypes.find((item) => item.id === tripType)?.label ?? ''),
        airport: tripType === 'airport' ? (airport?.name ?? '') : '',
        pickup: tripType === 'airport' && airportLeg === 'pickup' ? `${airport?.name ?? 'Airport'} Airport` : pickup,
        dropoff: tripType === 'airport' && airportLeg === 'dropoff' ? `${airport?.name ?? 'Airport'} Airport` : tripType === 'airport' ? pickup : dropoff,
        date,
        time,
        hours: tripType === 'hourly' ? String(hours) : '',
        returning: returning ? 'Yes' : 'No',
        returnAddress: returning ? returnAddress : '',
        vehicle: vehicle ? vehicleTitle(vehicle) : '',
        quote: selectedQuote?.amount != null ? formatPrice(selectedQuote.amount) : '',
        summary: [
          route && tripType !== 'hourly' ? `${route.miles} miles, about ${route.minutes} minutes${tripType === 'one-way' && !meterRates[vehicleId] ? `, charged as ${route.billedHours} hours` : ''}` : '',
          selectedQuote?.summary ?? '',
        ]
          .filter(Boolean)
          .join('. '),
        website,
      })
      setSubmitted(true)
    } catch {
      setError('We could not send that just now. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="relative pb-16 pl-4 pr-16 pt-28 sm:pl-6 sm:pr-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {book.backgroundImage && <img src={book.backgroundImage} alt="" className="h-full w-full object-cover object-center" />}
        <div className="absolute inset-0 bg-black/25" />
      </div>
      <div className="relative mx-auto grid w-full min-w-0 max-w-content items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="min-w-0 rounded-2xl border border-white/20 bg-black/35 p-4 text-white shadow-2xl backdrop-blur-md sm:p-6" style={{ colorScheme: 'dark' }}>
          {submitted ? (
            <div className="px-2 py-10 text-center">
              <h1 className="font-serif text-4xl text-white">Request received</h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Thank you{name ? `, ${name}` : ''}. We have your {tripTypes.find((item) => item.id === tripType)?.label.toLowerCase()}{' '}
                request
                {selectedQuote?.amount != null ? ` at ${formatPrice(selectedQuote.amount)}` : ''}. A member of the team will confirm it shortly.
              </p>
            </div>
          ) : (
            <>
              <ol className="mb-6 flex w-full min-w-0 items-center gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
                <li className="flex min-w-0 items-center gap-2 text-white">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs text-brand-primary-contrast">1</span>
                  <span className="truncate">Journey Details</span>
                </li>
                <span className="h-px flex-1 bg-white/20" />
                <li className={`flex shrink-0 items-center gap-2 ${step === 2 ? 'text-white' : 'text-white/40'}`}>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      step === 2 ? 'bg-brand-primary text-brand-primary-contrast' : 'border border-white/30'
                    }`}
                  >
                    2
                  </span>
                  Cars
                </li>
              </ol>

              {step === 1 ? (
                <form onSubmit={goNext} className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tripTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setTripType(type.id)}
                        className={`rounded-full px-4 py-2 text-[11px] font-semibold sm:text-sm ${
                          tripType === type.id ? 'border border-white/50 bg-white/15 text-white' : 'text-white/55'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {tripType === 'airport' ? (
                    <>
                      <label className="block text-sm font-medium">
                        Airport
                        <select className={`${fieldClass} mt-1`} value={airportId} onChange={(event) => setAirportId(event.target.value)} required>
                          {airports.map((airport) => (
                            <option key={airport.id} value={airport.id} className="bg-neutral-950 text-white">
                              {airport.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['pickup', 'dropoff'] as const).map((leg) => (
                          <button
                            key={leg}
                            type="button"
                            onClick={() => setAirportLeg(leg)}
                            className={`rounded-full px-4 py-2 text-[11px] font-semibold sm:text-sm ${
                              airportLeg === leg ? 'border border-white/50 bg-white/15 text-white' : 'text-white/55'
                            }`}
                          >
                            {leg === 'pickup' ? 'Pickup from airport' : `Drop-off to airport (+${formatPrice(airportDropoffFee)})`}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}

                  <AddressField
                    label={tripType === 'airport' ? (airportLeg === 'pickup' ? 'Drop-off address' : 'Pickup address') : 'Pickup Address'}
                    value={pickup}
                    placeId={pickupPlaceId}
                    required
                    placeholder="Address, airport, hotel..."
                    className={fieldClass}
                    onChange={(text, id) => {
                      setPickup(text)
                      setPickupPlaceId(id)
                    }}
                  />

                  {(tripType === 'one-way' || tripType === 'hourly') && (
                    <AddressField
                      label={tripType === 'hourly' ? 'Destination' : 'Dropoff Address'}
                      value={dropoff}
                      placeId={dropoffPlaceId}
                      required={tripType === 'one-way'}
                      placeholder={tripType === 'hourly' ? 'Optional. Miles over 10 per hour are charged.' : 'Address, airport, hotel...'}
                      className={fieldClass}
                      onChange={(text, id) => {
                        setDropoff(text)
                        setDropoffPlaceId(id)
                      }}
                    />
                  )}

                  <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block min-w-0 overflow-hidden text-sm font-medium">
                      Select Date
                      <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`${fieldClass} mt-1 h-12`} />
                    </label>
                    <label className="block min-w-0 overflow-hidden text-sm font-medium">
                      Select Time
                      <input required type="time" value={time} onChange={(event) => setTime(event.target.value)} className={`${fieldClass} mt-1 h-12`} />
                    </label>
                  </div>

                  {tripType === 'hourly' && (
                    <label className="block text-sm font-medium">
                      Hours
                      <input
                        required
                        type="number"
                        min={minimumHours}
                        value={hours}
                        onChange={(event) => setHours(Math.max(minimumHours, Number(event.target.value) || minimumHours))}
                        className={`${fieldClass} mt-1`}
                      />
                      <span className="mt-1 block text-xs font-normal text-white/50">Minimum booking is {minimumHours} hours. {includedMilesPerHour} miles per hour are included. Further miles are charged at the mileage rate.</span>
                    </label>
                  )}

                  <button
                    type="button"
                    onClick={() => setReturning((value) => !value)}
                    className={`ml-auto flex items-center gap-2 text-sm font-semibold ${returning ? 'text-brand-primary' : ''}`}
                  >
                    <span className="text-lg leading-none">+</span>
                    {returning ? 'Return booking added' : 'Add Return Booking'}
                  </button>

                  {returning && (
                    <AddressField
                      label="Return Address"
                      value={returnAddress}
                      placeId={returnPlaceId}
                      placeholder="Where should we bring you back?"
                      className={fieldClass}
                      onChange={(text, id) => {
                        setReturnAddress(text)
                        setReturnPlaceId(id)
                      }}
                    />
                  )}

                  {(tripType !== 'one-way' || routeState === 'loading' || route || routeError) && (
                    <div className="rounded-xl border border-white/15 bg-black/40 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-primary">Estimated fare</p>
                      {tripType !== 'hourly' && routeState === 'loading' && <p className="mt-2 text-sm text-white/70">Checking the route…</p>}
                      {tripType !== 'hourly' && routeState === 'error' && <p className="mt-2 text-sm text-white/70">{routeError}</p>}
                      {tripType !== 'hourly' && route && (
                        <p className="mt-2 text-sm text-white/75">
                          {route.miles} miles, about {route.minutes} minutes.
                        </p>
                      )}
                      {tripType === 'hourly' && routeState === 'loading' && <p className="mt-2 text-sm text-white/70">Checking the route…</p>}
                      {tripType === 'hourly' && routeState === 'error' && <p className="mt-2 text-sm text-white/70">{routeError}</p>}
                      {tripType === 'hourly' && (
                        <p className="mt-2 text-sm text-white/75">
                          {Math.max(hours || minimumHours, minimumHours)} hours at the hourly rate. Minimum booking is {minimumHours} hours. {includedMilesPerHour} miles per hour are included.
                          {route ? ` About ${returning ? Math.round(route.miles * 2 * 10) / 10 : route.miles} miles.` : ''} Further miles are charged at the mileage rate.
                          {returning ? ' The return journey is included in the mileage.' : ''}
                        </p>
                      )}
                      {tripType === 'airport' && routeState !== 'loading' && (
                        <p className="mt-2 text-sm text-white/75">
                          {selectedAirport?.name} {airportLeg === 'dropoff' ? `drop-off. Pickup fare plus ${formatPrice(airportDropoffFee)}.` : 'pickup fare.'}
                          {returning ? ' A return is the pickup fare plus the drop-off fare.' : ''}
                        </p>
                      )}
                      <ul className="mt-3 divide-y divide-white/10">
                        {vehicles.map((vehicle) => {
                          const quote = journeyPrice({ ...quoteOptions, vehicleId: vehicle.id }, catalog)
                          return (
                            <li key={vehicle.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                              <span>{vehicleTitle(vehicle)}</span>
                              <span className="font-semibold text-brand-primary">
                                {quote?.amount != null ? formatPrice(quote.amount) : 'Quote'}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                      <p className="mt-2 text-xs text-white/45">These rates are temporary. The team confirms the fare before you travel.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-full border border-white/25 bg-white/15 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white backdrop-blur"
                  >
                    Go Next
                  </button>
                </form>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-3">
                    {vehicles.map((vehicle) => {
                      const quote = journeyPrice({ ...quoteOptions, vehicleId: vehicle.id }, catalog)
                      const selected = vehicleId === vehicle.id
                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => setVehicleId(vehicle.id)}
                          className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left ${
                            selected ? 'border-brand-primary bg-white/15' : 'border-white/15 bg-white/5'
                          }`}
                        >
                          {vehicle.image ? (
                            <span className="h-14 w-[6.25rem] shrink-0 overflow-hidden rounded-lg bg-black sm:h-16 sm:w-28">
                              <img src={vehicle.image} alt="" className="h-full w-full object-contain" />
                            </span>
                          ) : (
                            <span className="h-14 w-[6.25rem] shrink-0 rounded-lg bg-black sm:h-16 sm:w-28" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{vehicleTitle(vehicle)}</span>
                            <span className="block text-xs text-white/50">
                              {vehicle.seats} · {tripType === 'one-way' && meterRates[vehicle.id] ? `${formatPrice(meterRates[vehicle.id]!.perMinute)}/min · ${formatPrice(meterRates[vehicle.id]!.perMile)}/mi` : vehicle.hourly > 0 ? `${formatPrice(vehicle.hourly)}/hour` : 'Fare on enquiry'}
                            </span>
                          </span>
                          <span className="shrink-0 font-serif text-xl text-brand-primary sm:text-2xl">{quote?.amount != null ? formatPrice(quote.amount) : 'Quote'}</span>
                        </button>
                      )
                    })}
                  </div>

                  {selectedQuote && <p className="text-sm text-white/70">{selectedQuote.summary}</p>}

                  <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium">
                      Your Name
                      <input required value={name} onChange={(event) => setName(event.target.value)} className={`${fieldClass} mt-1`} />
                    </label>
                    <label className="block text-sm font-medium">
                      Contact Number
                      <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={`${fieldClass} mt-1`} />
                    </label>
                  </div>
                  <label className="block text-sm font-medium">
                    Email Address
                    <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${fieldClass} mt-1`} />
                  </label>
                  <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  {error && <p className="text-sm text-red-300">{error}</p>}

                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <button type="button" onClick={() => setStep(1)} className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white">
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 rounded-full bg-brand-primary py-3 text-sm font-bold uppercase tracking-[0.12em] text-brand-primary-contrast disabled:opacity-60"
                    >
                      {sending ? 'Sending…' : `Request Booking ${selectedQuote?.amount != null ? formatPrice(selectedQuote.amount) : ''}`}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        <aside className="min-w-0 rounded-2xl border border-white/20 bg-black/35 p-5 text-white backdrop-blur-md sm:p-6">
          <h2 className="font-serif text-3xl">Price list</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Hourly hire is charged per hour, with a {minimumHours} hour minimum. {includedMilesPerHour} miles are included in each hour. Miles beyond that are charged at the mileage rate, so a long journey is not covered by the hours alone. An E-Class one-way journey is {formatPrice(meterRates['e-class']!.perMinute)} per minute plus {formatPrice(meterRates['e-class']!.perMile)} per mile. A V-Class one-way journey is {formatPrice(meterRates['v-class']!.perMinute)} per minute plus {formatPrice(meterRates['v-class']!.perMile)} per mile. A Range Rover one-way journey is {formatPrice(meterRates['range-rover']!.perMinute)} per minute plus {formatPrice(meterRates['range-rover']!.perMile)} per mile. An S-Class one-way journey is {formatPrice(meterRates['s-class']!.perMinute)} per minute plus {formatPrice(meterRates['s-class']!.perMile)} per mile. A 5 Series one-way journey is {formatPrice(meterRates['5-series']!.perMinute)} per minute plus {formatPrice(meterRates['5-series']!.perMile)} per mile. Airport prices below are the pickup fare. A drop-off to the airport is {formatPrice(airportDropoffFee)} more. A return is the pickup fare plus the drop-off fare. We accept cryptocurrency.
          </p>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">Per hour</h3>
          <ul className="mt-3 divide-y divide-white/10">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>{vehicleTitle(vehicle)}</span>
                <span className="text-right font-semibold text-brand-primary">{vehicle.hourly > 0 ? `${formatPrice(vehicle.hourly)} / hour` : 'On enquiry'}{vehicle.hourly > 0 ? <span className="mt-0.5 block text-xs font-normal text-neutral-400">{includedMilesPerHour} miles included</span> : null}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">Airports</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">Pickup fare, then drop-off. Drop-off is the pickup fare plus {formatPrice(airportDropoffFee)}.</p>
          <ul className="mt-3 space-y-3 lg:hidden">
            {airports.map((airport) => (
              <li key={airport.id} className="rounded-xl border border-white/10 px-3 py-3">
                <p className="font-semibold">{airport.name}</p>
                <dl className="mt-3 space-y-3 text-sm">
                  {vehicles.map((vehicle) => {
                    const pickupFare = airport.prices[vehicle.id]
                    return (
                      <div key={vehicle.id} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                        <dt className="font-medium">{vehicleTitle(vehicle)}</dt>
                        <dd className="mt-1 flex items-baseline justify-between gap-3">
                          <span className="text-neutral-400">Pickup</span>
                          <span className="font-semibold text-brand-primary">{fareCell(pickupFare)}</span>
                        </dd>
                        <dd className="mt-0.5 flex items-baseline justify-between gap-3">
                          <span className="text-neutral-400">Drop-off</span>
                          <span className="font-semibold text-brand-primary">{pickupFare == null ? '—' : formatPrice(pickupFare + airportDropoffFee)}</span>
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </li>
            ))}
          </ul>
          <div className="mt-3 hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="py-2 pr-3 font-medium">Airport</th>
                  {vehicles.map((vehicle) => (
                    <th key={vehicle.id} className="py-2 pr-3 font-medium">{vehicle.shortName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {airports.map((airport) => (
                  <tr key={airport.id} className="border-t border-white/10 align-top">
                    <td className="py-2.5 pr-3">{airport.name}</td>
                    {vehicles.map((vehicle) => {
                      const pickupFare = airport.prices[vehicle.id]
                      return (
                        <td key={vehicle.id} className="py-2.5 pr-3">
                          <span className="block">Pickup {fareCell(pickupFare)}</span>
                          <span className="block text-neutral-400">Drop-off {pickupFare == null ? '—' : formatPrice(pickupFare + airportDropoffFee)}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Book
