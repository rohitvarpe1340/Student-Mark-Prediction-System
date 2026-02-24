import { Component } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';


@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent {
student_name = '';
  email = '';
  contact = '';

  study_hours!: number;
  attendance!: number;
  assignment_marks!: number;

  loading = false;

  constructor(private studentService: StudentService) {}

  isValidEmail(email:string):boolean{
    const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailvalid.test(email);
  }

  predict() {
    if (
      !this.student_name ||
      !this.email ||
      !this.contact ||
      this.study_hours === undefined ||
      this.attendance === undefined ||
      this.assignment_marks === undefined
    ) {
      alert('Please fill all fields');
      return;
    }

    if(!this.isValidEmail(this.email)){
       alert('please enter valid email');
       return;
    }
    this.loading = true;

    const payload = {
      student_name: this.student_name,
      email: this.email,
      contact: this.contact,
      study_hours: this.study_hours,
      attendance: this.attendance,
      assignment_marks: this.assignment_marks
    };

    this.studentService.predictMarks(payload).subscribe({
      next: (res: { predicted_marks: number }) => {
        alert(`Predicted Marks: ${res.predicted_marks}`);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Prediction failed');
        this.loading = false;
      }
    });
  }
  formreset() {
    throw new Error('Method not implemented.');
  }



  sendMarksEmail() {
  if (!this.email) {
    alert('Please enter student email');
    return;
  }

  this.studentService.sendHistory(this.email).subscribe({
    next: (res: any) => alert(res.message),
    error: (err) => {
      console.error(err);
      alert('Failed to send email');
    }
  });
}





}
