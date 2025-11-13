import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import { Header, PropertyCard, RoomCard, SectionTitle } from './components/UI'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [me, setMe] = useState(null) // {_id,name,email,role}

  // Auth
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const login = async () => {
    const res = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: authForm.email, password: authForm.password }) })
    if (res.ok) setMe(await res.json())
  }
  const register = async () => {
    const res = await fetch(`${API}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) })
    if (res.ok) {
      await login()
    }
  }

  // Properties
  const [propsList, setPropsList] = useState([])
  const [city, setCity] = useState('')
  const loadProperties = async () => {
    const q = city ? `?city=${encodeURIComponent(city)}` : ''
    const res = await fetch(`${API}/api/properties${q}`)
    if (res.ok) setPropsList(await res.json())
  }
  useEffect(() => { loadProperties() }, [])

  // Rooms
  const [rooms, setRooms] = useState([])
  const loadRooms = async () => {
    const res = await fetch(`${API}/api/rooms`)
    if (res.ok) setRooms(await res.json())
  }
  useEffect(() => { loadRooms() }, [])

  // Create property (owner)
  const [propForm, setPropForm] = useState({ house_number: '', street: '', city: '', state: '', pincode: '', description: '' })
  const createProperty = async () => {
    if (!me || me.role !== 'owner') return alert('Owner login required')
    const res = await fetch(`${API}/api/properties`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...propForm, owner_id: me._id }) })
    if (res.ok) { await loadProperties(); alert('Property created with unique code.'); setPropForm({ house_number: '', street: '', city: '', state: '', pincode: '', description: '' }) }
  }

  // Create room
  const [roomForm, setRoomForm] = useState({ property_id: '', title: '', price: 0, photos: [] })
  const createRoom = async () => {
    if (!me || me.role !== 'owner') return alert('Owner login required')
    const res = await fetch(`${API}/api/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(roomForm) })
    if (res.ok) { await loadRooms(); alert('Room created'); setRoomForm({ property_id: '', title: '', price: 0, photos: [] }) }
  }

  // Rent flow
  const [rentalForm, setRentalForm] = useState({ room_id: '', owner_id: '', property_id: '', property_code: '', rent_day_of_month: 5, start_date: '' })
  const startRental = async () => {
    if (!me || me.role !== 'user') return alert('User login required')
    const payload = { ...rentalForm, user_id: me._id }
    const res = await fetch(`${API}/api/rentals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { alert('Rental created'); }
    else alert('Failed to create rental')
  }

  // Payment
  const [payment, setPayment] = useState({ rental_id: '', amount: 0, owner_signature_url: '', user_signature_url: '' })
  const submitPayment = async () => {
    const res = await fetch(`${API}/api/payments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payment) })
    if (res.ok) alert('Payment submitted and receipt emailed')
  }

  // Maintenance
  const [maint, setMaint] = useState({ rental_id: '', user_id: '', description: '' })
  const createMaint = async () => {
    const res = await fetch(`${API}/api/maintenance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(maint) })
    if (res.ok) alert('Request created')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header me={me} onLogout={() => setMe(null)} />
      <Hero />

      <main className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        {/* Auth */}
        <section id="auth" className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Welcome" subtitle="Login or create an account" />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Name" value={authForm.name} onChange={e=>setAuthForm({...authForm,name:e.target.value})} />
              <select className="input" value={authForm.role} onChange={e=>setAuthForm({...authForm,role:e.target.value})}>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
              <input className="input col-span-2" placeholder="Email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} />
              <input className="input col-span-2" type="password" placeholder="Password" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={login} className="btn-primary">Login</button>
              <button onClick={register} className="btn-secondary">Create account</button>
            </div>
          </motion.div>

          {/* Export */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Export Rentals" subtitle="Owners can download CSV of rentals" />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Owner ID" onChange={e=>setRentalForm({...rentalForm, owner_id:e.target.value})} />
              <input className="input" placeholder="From (YYYY-MM-DD)" />
              <input className="input" placeholder="To (YYYY-MM-DD)" />
            </div>
            <a className="btn-secondary mt-4 inline-flex" href={`${API}/api/rentals/export?owner_id=${encodeURIComponent(rentalForm.owner_id||'')}`}>Download CSV</a>
          </motion.div>
        </section>

        {/* Browse */}
        <section id="browse" className="mt-14">
          <SectionTitle title="Explore Properties" subtitle="Search by city and view rooms" />
          <div className="flex gap-3 mb-4">
            <input className="input" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
            <button onClick={loadProperties} className="btn-primary">Search</button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {propsList.map(p => <PropertyCard key={p._id} item={p} onSelect={()=> setRoomForm(r => ({...r, property_id: p._id}))} />)}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {rooms.map(r => <RoomCard key={r._id} room={r} onRent={(room)=> setRentalForm(f=>({...f, room_id: room._id}))} />)}
          </div>
        </section>

        {/* Owner create */}
        <section id="list" className="mt-14 grid md:grid-cols-2 gap-6">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="List Your Property" subtitle="Owners: create a property and get a unique code" />
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="House Number" value={propForm.house_number} onChange={e=>setPropForm({...propForm,house_number:e.target.value})} />
              <input className="input" placeholder="Street" value={propForm.street} onChange={e=>setPropForm({...propForm,street:e.target.value})} />
              <input className="input" placeholder="City" value={propForm.city} onChange={e=>setPropForm({...propForm,city:e.target.value})} />
              <input className="input" placeholder="State" value={propForm.state} onChange={e=>setPropForm({...propForm,state:e.target.value})} />
              <input className="input" placeholder="Pincode" value={propForm.pincode} onChange={e=>setPropForm({...propForm,pincode:e.target.value})} />
              <input className="input col-span-2" placeholder="Description" value={propForm.description} onChange={e=>setPropForm({...propForm,description:e.target.value})} />
            </div>
            <button onClick={createProperty} className="btn-primary mt-4">Create Property</button>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Add Rooms" subtitle="Attach rooms with photos to a property" />
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="Property ID" value={roomForm.property_id} onChange={e=>setRoomForm({...roomForm,property_id:e.target.value})} />
              <input className="input" placeholder="Title" value={roomForm.title} onChange={e=>setRoomForm({...roomForm,title:e.target.value})} />
              <input className="input" placeholder="Price" type="number" value={roomForm.price} onChange={e=>setRoomForm({...roomForm,price:parseFloat(e.target.value)})} />
              <input className="input col-span-2" placeholder="Photo URL (comma separated)" onChange={e=>setRoomForm({...roomForm,photos: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
            </div>
            <button onClick={createRoom} className="btn-secondary mt-4">Create Room</button>
          </motion.div>
        </section>

        {/* Rental */}
        <section id="rental" className="mt-14 grid md:grid-cols-2 gap-6">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Start Rental" subtitle="Users: enter property code to start rental" />
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="Room ID" value={rentalForm.room_id} onChange={e=>setRentalForm({...rentalForm,room_id:e.target.value})} />
              <input className="input" placeholder="Owner ID" value={rentalForm.owner_id} onChange={e=>setRentalForm({...rentalForm,owner_id:e.target.value})} />
              <input className="input" placeholder="Property ID" value={rentalForm.property_id} onChange={e=>setRentalForm({...rentalForm,property_id:e.target.value})} />
              <input className="input" placeholder="Property Code" value={rentalForm.property_code} onChange={e=>setRentalForm({...rentalForm,property_code:e.target.value})} />
              <input className="input" placeholder="Rent Day (1-28)" type="number" value={rentalForm.rent_day_of_month} onChange={e=>setRentalForm({...rentalForm,rent_day_of_month:parseInt(e.target.value||'0')})} />
              <input className="input" placeholder="Start Date YYYY-MM-DD" value={rentalForm.start_date} onChange={e=>setRentalForm({...rentalForm,start_date:e.target.value})} />
            </div>
            <button onClick={startRental} className="btn-primary mt-4">Create Rental</button>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Submit Payment" subtitle="Pay monthly rent and get emailed receipt" />
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="Rental ID" value={payment.rental_id} onChange={e=>setPayment({...payment,rental_id:e.target.value})} />
              <input className="input" placeholder="Amount" type="number" value={payment.amount} onChange={e=>setPayment({...payment,amount:parseFloat(e.target.value)})} />
              <input className="input col-span-2" placeholder="Owner Signature URL" value={payment.owner_signature_url} onChange={e=>setPayment({...payment,owner_signature_url:e.target.value})} />
              <input className="input col-span-2" placeholder="User Signature URL" value={payment.user_signature_url} onChange={e=>setPayment({...payment,user_signature_url:e.target.value})} />
            </div>
            <button onClick={submitPayment} className="btn-secondary mt-4">Submit Payment</button>
          </motion.div>
        </section>

        {/* Maintenance */}
        <section id="maintenance" className="mt-14 grid md:grid-cols-2 gap-6 mb-16">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Raise a Request" subtitle="Report anything not working" />
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="Rental ID" value={maint.rental_id} onChange={e=>setMaint({...maint,rental_id:e.target.value})} />
              <input className="input" placeholder="User ID" value={maint.user_id} onChange={e=>setMaint({...maint,user_id:e.target.value})} />
              <input className="input col-span-2" placeholder="Describe the issue" value={maint.description} onChange={e=>setMaint({...maint,description:e.target.value})} />
            </div>
            <button onClick={createMaint} className="btn-primary mt-4">Create Request</button>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="rounded-2xl bg-white shadow-lg p-6">
            <SectionTitle title="Tips" subtitle="Use property codes and room ids to connect flows" />
            <ul className="list-disc pl-5 text-gray-600 text-sm">
              <li>Owners create property → share unique code.</li>
              <li>Users pick a room and start rental with that code.</li>
              <li>Payments send email receipts with signatures.</li>
              <li>Export rentals as CSV for any period.</li>
            </ul>
          </motion.div>
        </section>
      </main>

      <style>{`
        .input { @apply w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20; }
        .btn-primary { @apply inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-semibold shadow hover:opacity-90; }
        .btn-secondary { @apply inline-flex items-center justify-center rounded-md bg-white text-gray-900 border border-black/10 px-4 py-2 text-sm font-semibold shadow; }
      `}</style>
    </div>
  )
}
