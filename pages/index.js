import Link from 'next/link'
import {Component} from 'react'
import {GraphQLClient} from 'graphql-request'

const graphQLClient = new GraphQLClient('/api/graphql', {})

export default class Index extends Component {

    constructor() {
        super();
        this.state = {events: [], filter: { title: '', description: '', time: '', location: ''}};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        this.loadAllEvents();
    }

    async loadAllEvents() {
        this.state = {events: [],};
        const query = `{ events { Title Time Location { City, State, Country } } }`;
        let data;
        try {
            data = await graphQLClient.request(query);
            if (!data) return <div>Loading...</div>
        } catch (e) {
            return <div>Failed to load</div>
        }
        this.setState({events: data.events,  filter: { title: '', description: '', time: '', location: ''}})
    }

    async handleSubmit(e) {
        e.preventDefault();
        let filter = {}
        for (let prop in this.state.filter) {
            if (this.state.filter[prop] !== '') {
                filter[prop] = this.state.filter[prop];
            }
        }
        const data = { filter: filter };
        const filterQuery = `query($filter: Filter) { events(filter: $filter) { Title Time Location { City, State, Country } } }`;
        let filteredData = await graphQLClient.request(filterQuery, data)
        this.setState({events: filteredData.events})
    }

    changeFilter = e => {
        const filter = this.state.filter;
        filter[e.target.name] = e.target.value;
        this.setState({
           filter: filter
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input name="title" type="text" placeholder="Title" onChange={e => this.changeFilter(e)}/>
                    <input name="time" type="date" placeholder="Date"  onChange={e => this.changeFilter(e)}/>
                    <input name="description" type="text" placeholder="Description"  onChange={e => this.changeFilter(e)}/>
                    <input name="location" type="text" placeholder="Location" onChange={e => this.changeFilter(e)}/>
                    <button type="submit">Filter</button>
                    <button type="reset" onClick={e => this.loadAllEvents(e)}>Reset</button>
                </form>
                {
                    this.state.events.map((event, i) => (
                        <div key={i}><Link href='/[id]'
                                           as={`/${i}`}><a>{event.Title}</a></Link> {event.Time} {event.Location.City} {event.Location.State} {event.Location.Country}
                        </div>
                    ))
                }
            </div>
        );
    }
}
