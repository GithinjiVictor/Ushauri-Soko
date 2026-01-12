import pandas as pd
from django.http import HttpResponse
from .models import Market, Produce, PriceLog, SalesRecord
from django.db import transaction
from datetime import datetime
from django.contrib.auth.models import User

# --- EXPORT HELPERS ---

def export_to_excel(queryset, model_name):
    """
    Converts a queryset to an Excel response.
    """
    # 1. Convert QuerySet to DataFrame
    data = list(queryset.values())
    df = pd.DataFrame(data)
    
    # 2. Create Response Object
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename={model_name}_report.xlsx'
    
    # 3. Write to Excel
    with pd.ExcelWriter(response, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=model_name, index=False)
        
    return response

def export_to_pdf(queryset, model_name, title="Report"):
    """
    Generates a PDF report from a queryset.
    """
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
    from reportlab.lib.styles import getSampleStyleSheet

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{model_name}_report.pdf"'

    doc = SimpleDocTemplate(response, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph(title, styles['Title']))

    # Data Preparation
    data = []
    
    # Get headers from the first object if exists
    if queryset.exists():
        # Get field names for headers
        headers = [field.name for field in queryset.model._meta.fields]
        data.append(headers)
        
        for obj in queryset:
            row = [str(getattr(obj, field)) for field in headers]
            data.append(row)
    else:
        elements.append(Paragraph("No data available.", styles['Normal']))
        doc.build(elements)
        return response

    # Create Table
    table = Table(data)
    
    # Add Style
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])
    table.setStyle(style)

    elements.append(table)
    doc.build(elements)
    
    return response

# --- IMPORT HELPERS ---

def validate_dataframe(df, required_columns):
    """
    Checks if the dataframe contains all required columns.
    Returns None if valid, raises ValueError if invalid.
    """
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

def import_markets(file):
    try:
        df = pd.read_excel(file)
        # Expected columns: Name, Transport Cost, Market Fee
        validate_dataframe(df, ["Name", "Transport Cost", "Market Fee"])
        
        created_count = 0
        
        with transaction.atomic():
            for _, row in df.iterrows():
                try:
                    Market.objects.update_or_create(
                        name=row['Name'],
                        defaults={
                            'transport_cost': row['Transport Cost'],
                            'market_fee': row['Market Fee']
                        }
                    )
                    created_count += 1
                except Exception as row_error:
                    # Provide row-specific error detail if possible
                    raise ValueError(f"Error in row {_ + 2}: {str(row_error)}")

        return {"success": True, "count": created_count}
    except Exception as e:
        return {"success": False, "error": str(e)}

def import_produce(file):
    try:
        df = pd.read_excel(file)
        # Expected columns: Name, Unit
        validate_dataframe(df, ["Name", "Unit"])

        created_count = 0
        
        with transaction.atomic():
            for _, row in df.iterrows():
                try:
                    Produce.objects.update_or_create(
                        name=row['Name'],
                        defaults={'unit': row['Unit']}
                    )
                    created_count += 1
                except Exception as row_error:
                    raise ValueError(f"Error in row {_ + 2}: {str(row_error)}")

        return {"success": True, "count": created_count}
    except Exception as e:
        return {"success": False, "error": str(e)}

def import_pricelogs(file):
    try:
        df = pd.read_excel(file)
        # Expected columns: Market, Produce, Price, Date
        validate_dataframe(df, ["Market", "Produce", "Price", "Date"])
        
        created_count = 0
        
        with transaction.atomic():
            for _, row in df.iterrows():
                try:
                    # Validate that Market and Produce exist
                    market_name = row['Market']
                    produce_name = row['Produce']
                    
                    if not Market.objects.filter(name=market_name).exists():
                         raise ValueError(f"Market '{market_name}' not found.")
                    if not Produce.objects.filter(name=produce_name).exists():
                         raise ValueError(f"Produce '{produce_name}' not found.")

                    market = Market.objects.get(name=market_name)
                    produce = Produce.objects.get(name=produce_name)
                    
                    PriceLog.objects.create(
                        market=market,
                        produce=produce,
                        price=row['Price'],
                        date=row['Date']
                    )
                    created_count += 1
                except Exception as row_error:
                    raise ValueError(f"Error in row {_ + 2}: {str(row_error)}")

        return {"success": True, "count": created_count}
    except Exception as e:
        return {"success": False, "error": str(e)}

def import_users(file):
    try:
        df = pd.read_excel(file)
        # Expected columns: Username, Password, Email, IsAdmin
        validate_dataframe(df, ["Username", "Password"])
        
        created_count = 0
        
        with transaction.atomic():
            for _, row in df.iterrows():
                try:
                    if not User.objects.filter(username=row['Username']).exists():
                        User.objects.create_user(
                            username=row['Username'],
                            email=row.get('Email', ''),
                            password=str(row['Password']), # Ensure string
                            is_staff=bool(row.get('IsAdmin', False))
                        )
                        created_count += 1
                except Exception as row_error:
                    raise ValueError(f"Error in row {_ + 2}: {str(row_error)}")

        return {"success": True, "count": created_count}
    except Exception as e:
        return {"success": False, "error": str(e)}
