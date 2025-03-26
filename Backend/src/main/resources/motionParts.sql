--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-03-26 13:45:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 240 (class 1255 OID 16713)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Actualiza la fecha/hora
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16714)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_price double precision,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16720)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 218
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 219 (class 1259 OID 16721)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    parent_id bigint
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16726)
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 220
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- TOC entry 235 (class 1259 OID 17024)
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    id integer NOT NULL,
    order_id integer,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    subtotal numeric(10,2) GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    CONSTRAINT order_details_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_details_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17023)
-- Name: order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_details_id_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 234
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- TOC entry 233 (class 1259 OID 17004)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    cart_id integer,
    total numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'Pendiente'::character varying NOT NULL,
    payment_method character varying(50),
    pickup_location character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orders_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17003)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 232
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 237 (class 1259 OID 17039)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(50) NOT NULL,
    transaction_id character varying(100),
    status character varying(50) DEFAULT 'Pendiente'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17038)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 236
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 221 (class 1259 OID 16745)
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    product_id bigint NOT NULL,
    category_id bigint NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16748)
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16749)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    reference character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    price integer NOT NULL,
    stock integer NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now(),
    image_url character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16756)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 230 (class 1259 OID 16863)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16862)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 229
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 239 (class 1259 OID 17061)
-- Name: shippings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shippings (
    id integer NOT NULL,
    order_id integer,
    user_id integer,
    shipping_method character varying(50) NOT NULL,
    address text,
    city character varying(100),
    postal_code character varying(20),
    status character varying(50) DEFAULT 'Pendiente'::character varying NOT NULL,
    tracking_number character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.shippings OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 17060)
-- Name: shippings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shippings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shippings_id_seq OWNER TO postgres;

--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 238
-- Name: shippings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shippings_id_seq OWNED BY public.shippings.id;


--
-- TOC entry 225 (class 1259 OID 16763)
-- Name: shopping_carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_carts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT shopping_carts_status_check CHECK (((status)::text = ANY (ARRAY[('ACTIVE'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELLED'::character varying)::text])))
);


ALTER TABLE public.shopping_carts OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16770)
-- Name: shopping_carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shopping_carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shopping_carts_id_seq OWNER TO postgres;

--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 226
-- Name: shopping_carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_carts_id_seq OWNED BY public.shopping_carts.id;


--
-- TOC entry 231 (class 1259 OID 16881)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16771)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16778)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 228
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4797 (class 2604 OID 16779)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 16780)
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 17027)
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 17007)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 17042)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 16781)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 16896)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 17064)
-- Name: shippings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippings ALTER COLUMN id SET DEFAULT nextval('public.shippings_id_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 16782)
-- Name: shopping_carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts ALTER COLUMN id SET DEFAULT nextval('public.shopping_carts_id_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 16783)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5026 (class 0 OID 16714)
-- Dependencies: 217
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, quantity, unit_price, created_at, updated_at, total_price) FROM stdin;
42	1	1	2	500000	2025-03-25 11:08:59.921744	2025-03-25 11:08:59.921744	1000000
\.


--
-- TOC entry 5028 (class 0 OID 16721)
-- Dependencies: 219
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, description, parent_id) FROM stdin;
1	Baterias	Baterias para automovil de diferentes tipos y marcas.	\N
2	Alternadores	Generadores eléctricos para automóviles que recargan la batería y alimentan los sistemas eléctricos.	\N
3	Bobinas de ignición	Componentes esenciales del sistema de encendido que transforman la corriente en alta tensión para las bujías.	\N
4	Luces	Diferentes tipos de iluminación para vehículos, incluyendo faros, luces traseras y auxiliares.	\N
5	Motores de arranque	Motores eléctricos diseñados para poner en marcha el motor de combustión interna del vehículo.	\N
6	Reguladores	Dispositivos que controlan la tensión eléctrica del alternador para evitar sobrecargas en el sistema.	\N
10	Bobinas completas línea	Bobinas en línea completas	3
8	Bateria Caja grande	Batería de caja 1000-1100	1
9	Alternador Tipo Valeo	Alternadores tipo Valeo original	2
11	Luces LED altas	Luces LED	4
12	Arranque Tipo Bosch	Motores de arranque tipo Bosch	5
13	Regulador Bosch	Reguladores marca Bosch	6
\.


--
-- TOC entry 5044 (class 0 OID 17024)
-- Dependencies: 235
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (id, order_id, product_id, quantity, unit_price) FROM stdin;
\.


--
-- TOC entry 5042 (class 0 OID 17004)
-- Dependencies: 233
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, cart_id, total, status, payment_method, pickup_location, created_at) FROM stdin;
\.


--
-- TOC entry 5046 (class 0 OID 17039)
-- Dependencies: 237
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, user_id, amount, payment_method, transaction_id, status, created_at) FROM stdin;
\.


--
-- TOC entry 5030 (class 0 OID 16745)
-- Dependencies: 221
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (product_id, category_id, id) FROM stdin;
1	1	1
1	8	2
2	2	3
3	2	4
3	9	5
4	3	6
4	10	7
5	3	8
6	4	9
6	11	10
7	4	11
8	5	12
9	5	13
9	12	14
10	6	15
10	13	16
11	6	17
\.


--
-- TOC entry 5032 (class 0 OID 16749)
-- Dependencies: 223
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) FROM stdin;
1	79836	Bateria Bosch	Caja 35/65 (BCI), D23 (JIS)	500000	5	2025-03-10 21:48:23.217568	2025-03-10 21:48:23.217568	\N
2	10001	Alternador Bosch 12V 90A	Alternador de alto rendimiento compatible con múltiples modelos de automóviles.	750000	10	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
3	10002	Alternador Valeo 14V 120A	Alternador de alta eficiencia, ideal para vehículos con mayor demanda eléctrica.	820000	8	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
4	20001	Bobina Bosch 0986JG	Bobina de encendido para motores de 4 cilindros, mejora el rendimiento del motor.	150000	15	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
5	20002	Bobina Denso 6731306	Bobina de ignición de alta resistencia para sistemas electrónicos modernos.	175000	12	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
6	30001	Faros LED H7 Philips	Luces delanteras LED de alto brillo y bajo consumo energético.	220000	20	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
7	30002	Kit de luces Xenón 6000K	Iluminación blanca intensa para una mejor visibilidad nocturna.	280000	10	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
8	40001	Motor de arranque Denso 2.2KW	Motor de arranque potente para vehículos de gasolina y diésel.	680000	5	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
9	40002	Motor de arranque Bosch 1.8KW	Arrancador compacto y eficiente, compatible con varias marcas.	720000	6	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
10	50001	Regulador de voltaje Bosch 14V	Regulador electrónico para alternadores de 14V.	90000	30	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
11	50002	Regulador de voltaje Valeo 12V	Regulador confiable para alternadores de 12V, protege el sistema eléctrico.	85000	25	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
\.


--
-- TOC entry 5039 (class 0 OID 16863)
-- Dependencies: 230
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	ADMIN
2	USER
3	EMPLEADO
\.


--
-- TOC entry 5048 (class 0 OID 17061)
-- Dependencies: 239
-- Data for Name: shippings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shippings (id, order_id, user_id, shipping_method, address, city, postal_code, status, tracking_number, created_at) FROM stdin;
\.


--
-- TOC entry 5034 (class 0 OID 16763)
-- Dependencies: 225
-- Data for Name: shopping_carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shopping_carts (id, user_id, status, created_at, updated_at) FROM stdin;
1	1	ACTIVE	2025-03-17 19:02:48.409567	2025-03-17 19:02:48.409567
\.


--
-- TOC entry 5040 (class 0 OID 16881)
-- Dependencies: 231
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	1
2	2
\.


--
-- TOC entry 5036 (class 0 OID 16771)
-- Dependencies: 227
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, created_at, updated_at) FROM stdin;
1	juanperez	juan.perez@example.com	$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
2	mariagonzalez	maria.gonzalez@example.com	$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
3	carlosramirez	carlos.ramirez@example.com	sapo123	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
\.


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 218
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 42, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 220
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 13, true);


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 234
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_id_seq', 1, false);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 232
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 236
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 222
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_id_seq', 17, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 229
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 238
-- Name: shippings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shippings_id_seq', 1, false);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 226
-- Name: shopping_carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_carts_id_seq', 1, true);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 228
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4830 (class 2606 OID 16785)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16787)
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- TOC entry 4834 (class 2606 OID 16789)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 17032)
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4854 (class 2606 OID 17012)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 17047)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 17049)
-- Name: payments payments_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);


--
-- TOC entry 4836 (class 2606 OID 16799)
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (product_id, category_id);


--
-- TOC entry 4838 (class 2606 OID 16801)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 16803)
-- Name: products products_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_reference_key UNIQUE (reference);


--
-- TOC entry 4848 (class 2606 OID 16910)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4850 (class 2606 OID 16898)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 17070)
-- Name: shippings shippings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippings
    ADD CONSTRAINT shippings_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 17072)
-- Name: shippings shippings_tracking_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippings
    ADD CONSTRAINT shippings_tracking_number_key UNIQUE (tracking_number);


--
-- TOC entry 4842 (class 2606 OID 16807)
-- Name: shopping_carts shopping_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16912)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 4844 (class 2606 OID 16809)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4846 (class 2606 OID 16811)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2620 OID 16812)
-- Name: users trigger_update_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4865 (class 2606 OID 16813)
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 16818)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 16823)
-- Name: category fk_category_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- TOC entry 4875 (class 2606 OID 17033)
-- Name: order_details order_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4873 (class 2606 OID 17018)
-- Name: orders orders_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE SET NULL;


--
-- TOC entry 4874 (class 2606 OID 17013)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4876 (class 2606 OID 17050)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4877 (class 2606 OID 17055)
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4868 (class 2606 OID 16833)
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 16838)
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 17073)
-- Name: shippings shippings_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippings
    ADD CONSTRAINT shippings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4879 (class 2606 OID 17078)
-- Name: shippings shippings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippings
    ADD CONSTRAINT shippings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4870 (class 2606 OID 16843)
-- Name: shopping_carts shopping_carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4871 (class 2606 OID 16913)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 4872 (class 2606 OID 16886)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-03-26 13:45:52

--
-- PostgreSQL database dump complete
--

