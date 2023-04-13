import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { AiFillGithub } from "react-icons/ai";
import { studentsData } from '@/assets/data';

export interface SeatType {
  [x: string]: string | number;
}

export default function Home() {
  const [students, setStudents] = useState<SeatType[]>(studentsData);
  const date = new Date();

  const cardRef = useRef<HTMLDivElement>(null);
  const onDownloadBtn = () => {
    const card = cardRef.current;
    domtoimage.toBlob(card as Node).then((blob) => {
      saveAs(
        blob,
        `${
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + String(date.getMonth() + 1)
        }${
          date.getDate() > 9 ? date.getDate() : "0" + String(date.getDate())
        } 3학년 1번 자리배치도.png`
      );
    });
  };

  const setEmptySeat = (seats: SeatType[]) => {
    return (seats = [
      { name: "빈자리" },
      ...seats.slice(0, 12),
      ...seats.slice(12),
    ]);
  };

  const shuffle = (array: SeatType[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const shuffleSeats = () => {
    let newStudents = students.filter((student) => student.id);
    shuffle(newStudents);
    newStudents = setEmptySeat(newStudents);
    newStudents.forEach((student) => {
      student.current_seat = newStudents.indexOf(student);
    });
    setStudents(newStudents);
  };

  return (
    <>
      <Head>
        <title>3학년 1반 자리 뽑기 사이트!</title>
      </Head>
      <div ref={cardRef} className={styles.background}>
        <h1 className={styles.title}>3학년 1반 자리 배치도</h1>
        <div className={styles.seat_container}>
          {[...students].reverse().map((item, index) => {
            return (
              <div key={index} className={styles.seat}>
                <span>
                  {item.id
                    ? `31${
                        Number(item.id) > 9
                          ? String(item.id)
                          : "0" + String(item.id)
                      }`
                    : ""}
                </span>
                <span>{String(item.name)}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <div className={styles.desk}>교탁</div>
          <div className={styles.watermark}>
            <span>★ made by 정승민 ★</span>
            <span className={styles.github}>
              <AiFillGithub />
              jsm8109jsm
            </span>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => shuffleSeats()} className={styles.button}>
          자리 섞기!
        </button>
        <button onClick={() => onDownloadBtn()} className={styles.button}>
          사진 저장!
        </button>
      </div>
    </>
  );
}
