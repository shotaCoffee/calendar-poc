import { addHours, addMinutes, eachDayOfInterval, eachHourOfInterval, eachWeekOfInterval, endOfMonth, endOfWeek, format, getDate, getDay, startOfDay, startOfMonth } from 'date-fns';
import { endOfDay } from 'date-fns/esm';
import ja from "date-fns/locale/ja";
import { useEffect, useState } from 'react';
import styled from 'styled-components'

interface Props {
  className?: string;
}

type View = 'Day'|'Week'|'Month';

// NOTE 1週間のセットを返す https://yucatio.hatenablog.com/entry/2019/12/24/080550
const getCalendars = (date: Date): Date[][] => {
  const sundays = eachWeekOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date)
  })
  return sundays.map(sunday => eachDayOfInterval({start: sunday, end: endOfWeek(sunday)}))
}

const store = (): {targetDate: Date, calendar: Date[][]} => {
  const targetDate = new Date();
  const calendar = getCalendars(targetDate);

  return {
    targetDate,
    calendar
  }
}


const CalendarComponent = ({className}: Props) => {
  const {targetDate, calendar} = store();
  const [view, setView] = useState<View>('Month')
  const [weekIndex, setWeekIndex] = useState(0);

  return (
    <div className={className}>
      <button onClick={() => setView('Day')}>日</button>
      <button onClick={() => setView('Week')}>週</button>
      <button onClick={() => setView('Month')}>月</button>

      {view === 'Day' && (<DayView targetDate={targetDate} />)}
      {view === 'Week' && (
        <>
          <button onClick={() => setWeekIndex(weekIndex + 1)} disabled={weekIndex === 0}>前の週</button>
          <button onClick={() => setWeekIndex(weekIndex - 1)} disabled={weekIndex === calendar.length - 1}>次の週</button>
          <WeekView targetDate={targetDate} week={calendar[weekIndex]} />
        </>
      )}
      {view === 'Month' && <MonthView targetDate={targetDate} weekSet={calendar}/>}
      
    </div>
  )
}

const Calendar = styled(CalendarComponent)``;

export default Calendar;


interface MonthViewProps {
  targetDate: Date
  weekSet: Date[][]
}

const MonthView = ({targetDate, weekSet}: MonthViewProps) => {
  return (
    <>
      <h2>月カレンダー / {format(targetDate, 'y年M月')}</h2>
      <table>
        <thead>
          <tr>
            <th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th>
          </tr>
        </thead>
        <tbody>
          {weekSet.map((weekRow, rowNum) => {
            return (
              <tr key={rowNum}>
                {weekRow.map(date => {
                  return (
                    <td key={getDay(date)}>{getDate(date)}</td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

const WeekView = ({targetDate, week}: {targetDate: Date, week:Date[]}) => {

  if(week === undefined) {
    return <p>loading...</p>
  }

  return (
    <>
      <h2>週カレンダー / {format(targetDate, 'dd')}</h2>
      <table>
        <thead>
          <tr>
            <th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {week.map((day, rowNum) => {
              return (
                <td key={rowNum}>{getDate(day)}</td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </>
  )
}

const DayView = ({targetDate}: {targetDate: Date}) => {
  const startOfTargetDate = startOfDay(targetDate);
  const endOfTargetDate = endOfDay(targetDate);
  
  const hours = eachHourOfInterval({
    start: startOfTargetDate,
    end: endOfTargetDate
  })

  return (
    <>
      <h2>その日</h2>
      <table>
        <thead>
          <tr>
            <th>{format(targetDate, 'dd')}</th>
          </tr>
        </thead>
        <tbody>
            {
              hours.map((hour, index) => {
                return (
                  <tr key={`day-${index}`}>
                    <td>{format(hour, 'pp', {locale: ja})}</td>
                  </tr>
                )
              })
            }
        </tbody>
      </table>
    </>
  )


}