import React from 'react'
import TemporaryDrawer from './ToggleButton.jsx';
import { useDrawer } from '../../context/DrawerContext.jsx';

function SearchTop() {
  const { open, setOpen } = useDrawer();
  return (
    <div className='flex font-bold text-3xl px-11 flex-row justify-between'>
      <h1 className="mt-[5px]">Chats</h1>
      <TemporaryDrawer />
    </div>
  )
}

export default SearchTop