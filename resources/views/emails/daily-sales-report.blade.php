<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daily Sales Report</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">

    <h2 style="margin-bottom: 5px;">Daily Sales Report</h2>
    <p style="margin-top: 0; color:#555;">
        {{ $today->format('F j, Y') }}
    </p>

    @forelse ($orders as $order)
        <div style="background:#ffffff; padding:15px; margin-bottom:20px; border-radius:6px;">
            <h3 style="margin-top:0;">
                Order #{{ $order['id'] }}
            </h3>

            <p style="margin:4px 0;">
                <strong>Customer:</strong> {{ $order['customer_name'] ?? 'N/A' }}
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
                @foreach ($order['items'] as $item)
                    <tr style="border-bottom:1px solid #eee;">
                        <!-- Image -->
                        <td width="100" style="padding:10px 0;">
                            <img
                                src="{{ $item['image_url'] }}"
                                alt="{{ $item['name'] }}"
                                width="80"
                                style="border-radius:4px; display:block;"
                            >
                        </td>

                        <!-- Details -->
                        <td style="padding-left:15px;">
                            <p style="margin:0; font-weight:bold;">
                                {{ $item['name'] }}
                            </p>
                            <p style="margin:4px 0; color:#666;">
                                Qty: {{ $item['quantity'] }}
                            </p>
                            <p style="margin:0;">
                                ₦{{ number_format($item['price'], 2) }}
                            </p>
                        </td>
                    </tr>
                @endforeach
            </table>

            <p style="text-align:right; margin-top:10px; font-weight:bold;">
                Total: ₦{{ number_format($order['total'], 2) }}
            </p>
        </div>
    @empty
        <p>No orders recorded today.</p>
    @endforelse

    <p style="text-align:center; color:#888; font-size:12px;">
        © {{ now()->year }} Your Store
    </p>

</body>
</html>
