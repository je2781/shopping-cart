<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Header\UnstructuredHeader;
use Carbon\Carbon;

class DailySalesReportMail extends Mailable
{
    use Queueable, SerializesModels;

    protected array $orders;
    protected Carbon $today;
    /**
     * Create a new message instance.
     */
    public function __construct(array $orders, Carbon $today)
    {
        $this->orders = $orders;
        $this->today = $today;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('jezeadiebuo5@gmail.com', 'Josh'),
            replyTo: [
                      new Address($this->to[0]['address'] ?? null, 'Admin'),
                  ],
            subject: 'Daily Sales Report Mail',
            using: [
                      function (Email $email) {
                          // Headers
                          $email->getHeaders()
                              ->addTextHeader('X-Message-Source', 'gmail.com')
                              ->add(new UnstructuredHeader('X-Mailer', 'Mailtrap PHP Client'))
                          ;

                          // Custom Variables
                          $email->getHeaders()
                              ->addTextHeader('X-Custom-user_id', '45982')
                              ->addTextHeader('X-Custom-batch_id', 'PSJ-12')
                          ;

                          // Category (should be only one)
                          $email->getHeaders()
                              ->addTextHeader('X-Category', 'Reporting')
                          ;
                      },
                  ]
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-sales-report',
            with: [
                'orders' => $this->orders,
                'today'  => $this->today,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
