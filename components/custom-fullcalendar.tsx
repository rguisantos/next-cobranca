'use client'

import { DateSelectArg, EventClickArg, EventSourceInput } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin, { DateClickArg, Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import ptBRLocale from '@fullcalendar/core/locales/pt-br';
import { useState } from 'react'
import { all } from 'axios'


interface Event {
    title: string;
    start: Date | string;
    id?: number;
    color?:string;
  }

interface CustomFullCalendarProps {
    items: Event[];
}
  
export const CustomFullCalendar: React.FC<CustomFullCalendarProps> = ({
items
}) => {
    const [allEvents, setAllEvents] = useState<Event[]>(items)
    function handleDateSelect(arg: DateSelectArg): void {
        addEvent({start:arg.start, title:"teste"});
    }

    function addEvent(event: Event){
        setAllEvents([...allEvents, event]);
    }

    function handleEventClick(arg: EventClickArg): void {
        console.log(arg)
    }

    function handleDateClick(arg: DateClickArg): void {
        console.log(arg)
    }

    return (
        <FullCalendar
        locale={ptBRLocale}
            plugins={[
                interactionPlugin,
                timeGridPlugin,
                dayGridPlugin
            ]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek dayGridDay'
            }}
            events={allEvents as EventSourceInput}
            slotDuration={"00:40:00"}
            slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short'
            }}
            slotMinTime={"07:30:00"}
            slotMaxTime={"18:20:00"}
            allDaySlot={false}
            nowIndicator={true}
            expandRows={true}
            hiddenDays={[ 0,6 ]}
            businessHours={{
                daysOfWeek:[1, 2, 3, 4, 5],
                startTime: '07:30', 
                endTime: '18:00',
            }}
            // selectable={true}
            // select={handleDateSelect}
            eventClick={handleEventClick}
            // editable={true}
            // droppable={true}
            // selectable={true}
            // selectMirror={true}
            dateClick={handleDateClick}
            // drop={(data) => addEvent(data)}
            // eventClick={(data) => handleDeleteModal(data)}
            direction='ltr'
            firstDay={new Date().getDay()}
            contentHeight={"80vh"}
        />
    )
};