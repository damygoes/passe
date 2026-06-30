interface Props {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

export function TripStats({ countriesCount, citiesCount, yearsCount }: Props) {
  return (
    <div className="mt-6 flex gap-8 border-y py-4">
      <div>
        <p className="text-2xl font-semibold">{countriesCount}</p>
        <p className="text-sm text-muted-foreground">
          {countriesCount === 1 ? 'Country' : 'Countries'}
        </p>
      </div>
      <div>
        <p className="text-2xl font-semibold">{citiesCount}</p>
        <p className="text-sm text-muted-foreground">{citiesCount === 1 ? 'City' : 'Cities'}</p>
      </div>
      <div>
        <p className="text-2xl font-semibold">{yearsCount}</p>
        <p className="text-sm text-muted-foreground">{yearsCount === 1 ? 'Year' : 'Years'}</p>
      </div>
    </div>
  )
}
