import prismadb from "@/lib/prismadb";


export const createAndGetSlots = async (clinicaId: string) => {
  const corte = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 45))
  const especialistasQuePrecisamCriarSlots = await prismadb.especialista.findMany({
    where: {
      clinicaId,
      slotAt: {
        // new Date() creates date with current time and day and etc.
        lt: new Date(corte.getTime()-86400000)
      }
    }
  });

  await especialistasQuePrecisamCriarSlots.forEach(async(especialista) => {

    const slots = [];
    for(let timestamp = 0;corte.getTime() > especialista.slotAt.getTime() + timestamp; timestamp+=(1000 * 60 * 60 * 24)){
      const dia = new Date(especialista.slotAt.getTime() + timestamp);
      if(dia.getDay()===0 || dia.getDay()===6) continue;

      const iniciodia = new Date(dia.getFullYear(),dia.getMonth(),dia.getDate(),7,30,0,0);
      const ultimododia = new Date(dia.getFullYear(),dia.getMonth(),dia.getDate(),17,30,0,0);
      
      for(let timestamp_dia =0;iniciodia.getTime()+timestamp_dia<=ultimododia.getTime();timestamp_dia+=(1000 * 60 * 40)){
        slots.push(new Date(iniciodia.getTime()+timestamp_dia));
      }
      
      if(new Date(especialista.slotAt.getTime() + timestamp+(1000 * 60 * 60 * 24)).getDay()===6)
        timestamp+=(1000 * 60 * 60 * 24);

      if(new Date(especialista.slotAt.getTime() + timestamp+(1000 * 60 * 60 * 24)).getDay()===0)
        timestamp+=(1000 * 60 * 60 * 24);

    }
    
    const objSlots = [...slots.map(item => {return {datahora:item, especialistaId:especialista.id}})];
    
    await prismadb.especialista.update({
      where: {
        id: especialista.id
      },
      data: {
        slotAt: corte,
      },
    });
    
    await objSlots.forEach(async(slot)=>{
      await prismadb.slot.create({
        data:{
          datahora: slot.datahora,
          especialistaId: slot.especialistaId
        }
      });
    })
  });
  const inicio = new Date(new Date().getTime()-(1000 *60*60*24*7));
  inicio.setHours(0);
  inicio.setMinutes(0);
  inicio.setSeconds(0);
  inicio.setMilliseconds(0);
  
  const fim = new Date(new Date().getTime()+(1000 *60*60*24*90));
  fim.setHours(23);
  fim.setMinutes(59);
  fim.setSeconds(59);
  fim.setMilliseconds(999);
  const slotsdb = await prismadb.slot.findMany({
    where:{
      datahora: {
        gte: inicio,
        lte: fim,
      },
    },
    include:{
      especialista:true
    }
  })

  return [...slotsdb.map(slot=>{return {
    title:`✅ ${slot.paciente} (${slot.especialista.name})`,
    start:slot.datahora,
    color:slot.especialista.color
  }})]
};