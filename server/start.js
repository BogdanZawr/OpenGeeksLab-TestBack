// import extraTaskInfoWrite  from "./model/write/extraTaskInfo";

// let firstExtraTaskInfo = async () => {
//   let res = await extraTaskInfoWrite.findRow({
//     query:{
//       title: info
//     }
//   });
//   if (!res) {
//     await extraTaskInfoWrite.insertRow({
//       data: {
//         title: info
//       }
//     })
//   }
// }

export default async () => {
  try {
    // await firstExtraTaskInfo();
  } catch (err) {
    console.log(err);
  }
};
