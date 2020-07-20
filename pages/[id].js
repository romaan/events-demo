import { useRouter } from 'next/router';
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (query) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data)

export default function Event() {
  const router = useRouter();
  const { data, error } = useSWR(`{   events(filter: {id: ${router.query.id}})  {     Title     Time    Image    Location {      City       State      Country    }    AvailableSeats {      id    }  } }`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { events } = data;
  return (
    <>
    <div>
      {events.map((event, i) => (
        <>
        <div>Title: {event.Title}</div>
        <div>Time: {event.Time}</div>
        <div>Image: {event.Image}</div>
        <div>Location: {event.Location.City} {event.Location.State} {event.Location.Country}</div>
        <div>Available Seat: {event.AvailableSeats.map(seat => <span> {seat.id} </span>)}</div>
        </>
      ))}
    </div>
    <Link href="/"><a>Back</a></Link>
    </>
  )
}
