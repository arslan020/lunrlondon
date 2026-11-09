import { useMemo, useState, type FormEvent } from 'react'
import {
  airports,
  formatPrice,
  journeyPrice,
  minimumHours,
  vehicles,
  type TripType,
  type VehicleId,
} from '../data/pricing'

const tripTypes: { id: TripType; label: string }[] = [
  { id: 'one-way', label: 'One Way' },
  { id: 'airport', label: 'Airport Pickup' },
  { id: 'hourly', label: 'Hourly' },
]

const fareCell = (amount?: number) => (amount != null ? formatPrice(amount) : '—')

const fieldClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-3 text-base text-neutral-900 outline-none focus:border-neutral-900'

function Book() {
  const [step, setStep] = useState<1 | 2>(1)
  const [tripType, setTripType] = useState<TripType>('one-way')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [airportId, setAirportId] = useState(airports[1].id)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('21:15')
  const [hours, setHours] = useState(minimumHours)
  const [returning, setReturning] = useState(false)
  const [vehicleId, setVehicleId] = useState<VehicleId>('v-class')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const quoteOptions = { tripType, hours, airportId, pickup, dropoff, returning }

  const selectedQuote = useMemo(
    () => journeyPrice({ ...quoteOptions, vehicleId }),
    [tripType, hours, airportId, pickup, dropoff, returning, vehicleId],
  )

  const goNext = (event: FormEvent) => {
    event.preventDefault()
    setStep(2)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="bg-black px-4 pb-16 pt-28 sm:px-6 md:pt-32">
      <div className="mx-auto grid max-w-content items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="rounded-2xl bg-white p-4 text-neutral-900 shadow-2xl sm:p-6" style={{ colorScheme: 'light' }}>
          {submitted ? (
            <div className="px-2 py-10 text-center">
              <h1 className="font-serif text-4xl text-neutral-900">Request received</h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
                Thank you{name ? `, ${name}` : ''}. We have your {tripTypes.find((item) => item.id === tripType)?.label.toLowerCase()}{' '}
                request
                {selectedQuote?.amount != null ? ` at ${formatPrice(selectedQuote.amount)}` : ''}. A member of the team will confirm it shortly.
              </p>
            </div>
          ) : (
            <>
              <ol className="mb-6 flex items-center gap-3 text-sm font-semibold">
                <li className="flex items-center gap-2 text-neutral-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">1</span>
                  Journey Details
                </li>
                <span className="h-px flex-1 bg-neutral-200" />
                <li className={`flex items-center gap-2 ${step === 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      step === 2 ? 'bg-neutral-900 text-white' : 'border border-neutral-300'
                    }`}
                  >
                    2
                  </span>
                  Cars
                </li>
              </ol>

              {step === 1 ? (
                <form onSubmit={goNext} className="space-y-4">
                  <div className="grid grid-cols-3 border-b border-neutral-200">
                    {tripTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setTripType(type.id)}
                        className={`px-1 pb-3 text-center text-xs font-semibold sm:text-sm ${
                          tripType === type.id ? 'border-b-2 border-[#c4a15a] text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {tripType === 'airport' ? (
                    <label className="block text-sm font-medium">
                      Airport
                      <select className={`${fieldClass} mt-1`} value={airportId} onChange={(event) => setAirportId(event.target.value)} required>
                        {airports.map((airport) => (
                          <option key={airport.id} value={airport.id}>
                            {airport.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  <label className="block text-sm font-medium">
                    {tripType === 'airport' ? 'Pickup or drop-off address' : 'Pickup Address'}
                    <input
                      required
                      value={pickup}
                      onChange={(event) => setPickup(event.target.value)}
                      placeholder="Address, airport, hotel..."
                      className={`${fieldClass} mt-1`}
                    />
                  </label>

                  {tripType !== 'hourly' && (
                    <label className="block text-sm font-medium">
                      Dropoff Address
                      <input
                        required={tripType === 'one-way'}
                        value={dropoff}
                        onChange={(event) => setDropoff(event.target.value)}
                        placeholder="Address, airport, hotel..."
                        className={`${fieldClass} mt-1`}
                      />
                    </label>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium">
                      Select Date
                      <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`${fieldClass} mt-1`} />
                    </label>
                    <label className="block text-sm font-medium">
                      Select Time
                      <input required type="time" value={time} onChange={(event) => setTime(event.target.value)} className={`${fieldClass} mt-1`} />
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
                        onChange={(event) => setHours(Number(event.target.value))}
                        className={`${fieldClass} mt-1`}
                      />
                      <span className="mt-1 block text-xs font-normal text-neutral-500">{minimumHours}-hour minimum</span>
                    </label>
                  )}

                  <button
                    type="button"
                    onClick={() => setReturning((value) => !value)}
                    className="ml-auto flex items-center gap-2 text-sm font-semibold"
                  >
                    <span className="text-lg leading-none">+</span>
                    {returning ? 'Return booking added' : 'Add Return Booking'}
                  </button>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-full bg-neutral-950 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white"
                  >
                    Go Next
                  </button>
                </form>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-3">
                    {vehicles.map((vehicle) => {
                      const quote = journeyPrice({ ...quoteOptions, vehicleId: vehicle.id })
                      const selected = vehicleId === vehicle.id
                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => setVehicleId(vehicle.id)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left ${
                            selected ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                          }`}
                        >
                          <img src={vehicle.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{vehicle.shortName}</span>
                            <span className="block text-xs text-neutral-500">
                              {vehicle.seats} · {formatPrice(vehicle.hourly)}/hour
                            </span>
                          </span>
                          <span className="font-serif text-2xl">{quote?.amount != null ? formatPrice(quote.amount) : 'Quote'}</span>
                        </button>
                      )
                    })}
                  </div>

                  {selectedQuote && <p className="text-sm text-neutral-600">{selectedQuote.summary}</p>}

                  <div className="grid gap-4 sm:grid-cols-2">
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

                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <button type="button" onClick={() => setStep(1)} className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold">
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-brand-primary py-3 text-sm font-bold uppercase tracking-[0.12em] text-brand-primary-contrast"
                    >
                      Request Booking {selectedQuote?.amount != null ? formatPrice(selectedQuote.amount) : ''}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        <aside className="rounded-2xl border border-white/10 bg-[#141413] p-5 text-white sm:p-6">
          <h2 className="font-serif text-3xl">Price list</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Hourly hire is charged per hour. Airport fares are fixed from central London. A return booking doubles the fare.
          </p>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">Per hour</h3>
          <ul className="mt-3 divide-y divide-white/10">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>{vehicle.shortName}</span>
                <span className="font-semibold text-brand-primary">{formatPrice(vehicle.hourly)} / hour</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">Airports</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="py-2 pr-3 font-medium">Airport</th>
                  <th className="py-2 pr-3 font-medium">E-Class</th>
                  <th className="py-2 pr-3 font-medium">V-Class</th>
                  <th className="py-2 pr-3 font-medium">Range Rover</th>
                  <th className="py-2 font-medium">S-Class</th>
                </tr>
              </thead>
              <tbody>
                {airports.map((airport) => (
                  <tr key={airport.id} className="border-t border-white/10">
                    <td className="py-2.5 pr-3">{airport.name}</td>
                    <td className="py-2.5 pr-3">{fareCell(airport.prices['e-class'])}</td>
                    <td className="py-2.5 pr-3">{fareCell(airport.prices['v-class'])}</td>
                    <td className="py-2.5 pr-3">{fareCell(airport.prices['range-rover'])}</td>
                    <td className="py-2.5">{fareCell(airport.prices['s-class'])}</td>
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
