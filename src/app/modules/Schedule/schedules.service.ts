

import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../shared/prisma';
import { ISchedule } from './schedule.interface';
import { Schedule } from '@prisma/client';



const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
  }




  const insertIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;
  
    const interverlTime = 30;
  
    const schedules = [];
  
    const currentDate = new Date(startDate); // start date
    const lastDate = new Date(endDate) // end date
  
    while (currentDate <= lastDate) {
      // 09:30  ---> ['09', '30']
      const startDateTime = new Date(
        addMinutes(
          addHours(
            `${format(currentDate, 'yyyy-MM-dd')}`,
            Number(startTime.split(':')[0])
          ),
          Number(startTime.split(':')[1])
        )
      );
  
      const endDateTime = new Date(
        addMinutes(
          addHours(
            `${format(currentDate, 'yyyy-MM-dd')}`,
            Number(endTime.split(':')[0])
          ),
          Number(endTime.split(':')[1])
        )
      );
  
      while (startDateTime < endDateTime) {
        // const scheduleData = {
        //     startDateTime: startDateTime,
        //     endDateTime: addMinutes(startDateTime, interverlTime)
        // }
  
        const s = await convertDateTime(startDateTime);
        const e = await convertDateTime(addMinutes(startDateTime, interverlTime))
  
        const scheduleData = {
          startDate: s,
          endDate: e
        }
  
        const existingSchedule = await prisma.schedule.findFirst({
          where: {
            startDate: scheduleData.startDate,
            endDate: scheduleData.endDate
          }
        });
  
        if (!existingSchedule) {
          const result = await prisma.schedule.create({
            data: scheduleData
          });
          schedules.push(result);
        }
  
        startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
      }
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return schedules;
  };


export const ScheduleService = {
    insertIntoDB
}