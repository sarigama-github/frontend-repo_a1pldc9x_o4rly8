import { useState } from 'react'
import { Star, MapPin, Home, DoorOpen, User, LogIn, LogOut, Plus, Calendar, Upload, Wrench } from 'lucide-react'

export function Header({ me, onLogout }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-extrabold text-xl">RentHub</a>
        <nav className="flex items-center gap-3">
          <a href="#browse" className="text-sm text-gray-700 hover:text-black">Explore</a>
          <a href="#list" className="text-sm text-gray-700 hover:text-black">List</a>
          <a href="#maintenance" className="text-sm text-gray-700 hover:text-black">Requests</a>
        </nav>
        <div className="flex items-center gap-2">
          {me ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{me.name} ({me.role})</span>
              <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-900 text-white text-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="#auth" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-900 text-white text-sm"><LogIn size={16}/> Login</a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export function PropertyCard({ item, onRate, onSelect }) {
  return (
    <div className="group rounded-xl border border-black/5 p-4 bg-white hover:shadow-xl transition-all cursor-pointer" onClick={() => onSelect?.(item)}>
      <div className="aspect-video rounded-lg bg-gray-100 mb-3" style={{backgroundImage: item.cover?`url(${item.cover})`:undefined, backgroundSize:'cover'}} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-2"><Home size={18}/>{item.street}, {item.city}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={14}/> {item.state} • Code {item.unique_code}</div>
        </div>
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500"/>
          <span className="text-sm">{(item.rating_avg||0).toFixed(1)} ({item.rating_count||0})</span>
        </div>
      </div>
    </div>
  )
}

export function RoomCard({ room, onRent }) {
  return (
    <div className="rounded-xl border border-black/5 p-4 bg-white hover:shadow-xl transition-all">
      <div className="aspect-video rounded-lg bg-gray-100 mb-3" style={{backgroundImage: room.photos?.[0]?`url(${room.photos[0]})`:undefined, backgroundSize:'cover'}} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-2"><DoorOpen size={18}/>{room.title}</div>
          <div className="text-xs text-gray-500">${room.price.toFixed(2)} / month</div>
        </div>
        <button onClick={() => onRent?.(room)} className="px-3 py-2 rounded-md bg-gray-900 text-white text-sm">Rent</button>
      </div>
    </div>
  )
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
  )
}
